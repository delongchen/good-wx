import {TellerRuleToken, TellerRuleTokenType} from './token'
import {TellerRuleTerm} from "@/core/rule-compiler/expr.ts";
import {StringScope, StrRefMap} from "@/core/rule-compiler/types.ts";
import {calculateStr} from "@/core/rule-compiler/utils.ts";

const createToken = (
  type: TellerRuleTokenType,
  lexeme: string,
  literal: any,
  line: number
): TellerRuleToken => {
  return {
    type,
    lexeme,
    literal,
    line,
  }
}

const TextDelimiterSet = new Set(' \t\r\n$,;:>{}[]()"\'')
const isDigit = (c: string) => c >= '0' && c <= '9'
const isAlpha = (c: string) => (
  (c >= 'a' && c <= 'z') ||
  (c >= 'A' && c <= 'Z') ||
  c === '_' ||
  c === '$'
)
const isAlphaNumeric = (c: string) => isAlpha(c) || isDigit(c)

const scan = (source: string) => {
  const tokens: TellerRuleToken[] = []
  const errors: { line: number, message: string }[] = []

  const reportErr = (line: number, message: string) => {
    errors.push({line, message})
  }

  let line = 1
  let start = 0
  let current = 0

  const isAtEnd = () => current >= source.length

  const advance = () => source[current++]

  const addToken = (type: TellerRuleTokenType, literal: any = null) => {
    tokens.push(createToken(
      type,
      source.slice(start, current),
      literal,
      line,
    ))
  }

  const peek = () => isAtEnd() ? '' : source[current]
  const peekNext = () => current + 1 >= source.length ? '' : source[current + 1]

  const startString = (escape: string) => {
    while (peek() !== escape && !isAtEnd()) {
      if (peek() === '\n') line += 1
      advance()
    }

    if (isAtEnd()) {
      reportErr(line, 'Unterminated string.')
      return
    }

    advance()

    addToken(
      TellerRuleTokenType.String,
      source.slice(start + 1, current - 1)
    )
  }

  const startNumber = () => {
    while (isDigit(peek())) advance()

    if (peek() === '.' && isDigit(peekNext())) {
      advance()
      while (isDigit(peek())) advance()
    }

    addToken(TellerRuleTokenType.Number, Number(source.slice(start, current)))
  }

  const identifier = () => {
    while (isAlphaNumeric(peek())) advance()

    const literal = source.slice(start + 1, current)
    if (literal === '') return
    addToken(
      TellerRuleTokenType.Identifier,
      literal,
    )
  }

  const startText = () => {
    while (!TextDelimiterSet.has(peek()) && !isAtEnd()) advance()
    addToken(
      TellerRuleTokenType.String,
      source.slice(start, current)
    )
  }

  const scanToken = () => {
    const c = advance()

    switch (c) {
      case '(':
        addToken(TellerRuleTokenType.LeftParen);
        break
      case ')':
        addToken(TellerRuleTokenType.RightParen);
        break
      case '{':
        addToken(TellerRuleTokenType.LeftBrace);
        break
      case '}':
        addToken(TellerRuleTokenType.RightBrace);
        break
      case '[':
        addToken(TellerRuleTokenType.LeftSquareBracket);
        break
      case ']':
        addToken(TellerRuleTokenType.RightSquareBracket);
        break
      case ',':
        addToken(TellerRuleTokenType.Comma);
        break
      case ';':
        addToken(TellerRuleTokenType.Semicolon);
        break
      case ':':
        addToken(TellerRuleTokenType.Colon);
        break
      case '-':
        addToken(TellerRuleTokenType.Minus);
        break
      case '+':
        addToken(TellerRuleTokenType.Plus)
        break
      case '>':
        addToken(TellerRuleTokenType.Greater);
        break

      case ' ':
      case '\r':
      case '\t':
        break
      case '\n':
        line += 1
        break

      case "'":
      case '"':
        startString(c)
        break

      default: {
        if (isDigit(c)) {
          startNumber()
        } else if (c === '$') {
          identifier()
        } else {
          startText()
        }
      }
    }
  }

  while (!isAtEnd()) {
    start = current
    scanToken()
  }
  tokens.push(createToken(
    TellerRuleTokenType.EOF,
    '',
    null,
    line,
  ))
  return [errors, tokens] as [{ line: number, message: string }[], TellerRuleToken[]]
}

//      chain -> term (">" term)* ";"
//       term -> (STRING | array | computed)*
//   computed -> "{" expression "}"
//      array -> "[" (term ",")* "]"
// expression -> str ( "+" value )*
//        str -> STRING | identifier (scope)*
//      scope -> "[" (NUMBER | ((NUMBER) ":" (NUMBER) )) "]"
const parse = (tokens: TellerRuleToken[]) => {
  let current = 0

  const peek = () => tokens[current]
  const isAtEnd = () => peek().type === TellerRuleTokenType.EOF
  const previous = () => tokens[current - 1]
  const advance = () => {
    if (!isAtEnd()) current += 1
    return previous()
  }
  const check = (type: TellerRuleTokenType) => {
    if (isAtEnd()) return false
    return peek().type === type
  }
  const match = (...types: TellerRuleTokenType[]) => {
    for (const type of types) {
      if (check(type)) {
        advance()
        return true
      }
    }
    return false
  }

  const num = () => {
    let isMinus = false
    if (match(TellerRuleTokenType.Minus)) {
      isMinus = true
    }
    if (match(TellerRuleTokenType.Number)) {
      const n = previous().literal as number
      return isMinus ? -n : n
    }
    return NaN
  }

  const scope = () => {
    const result: StringScope[] = []

    while (match(TellerRuleTokenType.LeftSquareBracket)) {
      const start = num()
      const slice = match(TellerRuleTokenType.Colon)
      const end = num()
      if (!match(TellerRuleTokenType.RightSquareBracket)) {
        throw new Error('need ]')
      }
      result.push({start, end, slice})
    }

    return result
  }

  const str = () => {
    if (match(
      TellerRuleTokenType.String,
      TellerRuleTokenType.Identifier,
    )) {
      const prev = previous()
      const literal = prev.literal as string
      const isRef = prev.type === TellerRuleTokenType.Identifier
      const scopes = scope()

      if (!isRef) return calculateStr(literal, scopes)
      return (refMap: StrRefMap) => {
        const refValue = refMap[literal]
        if (refValue === undefined) return ''
        return calculateStr(refValue, scopes)
      }
    }

    throw new Error('need str')
  }

  const expr = () => {
    const strValues = [str()]

    while (match(TellerRuleTokenType.Plus)) {
      strValues.push(str())
    }

    return (refMap: StrRefMap) => {
      let result = ''
      for (const strValue of strValues) {
        if (typeof strValue === 'string') {
          result += strValue
        } else {
          result += strValue(refMap)
        }
      }
      return result
    }
  }

  const arr = () => {
    const terms: TellerRuleTerm[] = [term()]

    while (match(TellerRuleTokenType.Comma)) {
      terms.push(term())
    }

    return terms
  }

  const term = () => {
    const root = new TellerRuleTerm()

    while (match(
      TellerRuleTokenType.String,
      TellerRuleTokenType.LeftBrace,
      TellerRuleTokenType.LeftSquareBracket
    )) {
      const prev = previous()
      if (prev.type === TellerRuleTokenType.LeftBrace) {
        root.addChild(expr())
        advance()
      } else if (prev.type === TellerRuleTokenType.LeftSquareBracket) {
        root.addChild(arr())
        advance()
      } else {
        root.addChild(prev.literal)
      }
    }

    return root
  }

  const chain = () => {
    const terms = [term()]

    while (match(TellerRuleTokenType.Greater)) {
      terms.push(term())
    }

    if (!match(TellerRuleTokenType.Semicolon)) {
      throw new Error('chain bad end')
    }

    return terms.filter(it => it.size() !== 0)
  }

  const result: TellerRuleTerm[][] = []
  while (!isAtEnd()) {
    result.push(chain())
  }
  return result
}

export const compile = (source: string) => {
  const [errors, tokens] = scan(source)
  if (errors.length !== 0) return errors

  const result: Map<string, string> = new Map

  const replaceChainList = parse(tokens)
  for (const chain of replaceChainList) {
    const [input, ...handlers] = chain
    if (input === undefined) continue
    if (handlers.length === 0) continue

    const first = input.expand([], true)
    let last = first
    for (const handler of handlers) {
      last = handler.expand(last)
    }

    for (let i = 0; i < last.length; i++)
      if (first[i] !== last[i])
        result.set(first[i], last[i])
  }

  return result
}
