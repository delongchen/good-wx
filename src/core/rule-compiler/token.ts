export const enum TellerRuleTokenType {
  // Single-character tokens.
  LeftParen, // '('
  RightParen, // ')'
  LeftBrace, // '{'
  RightBrace, // '}'
  LeftSquareBracket, // '['
  RightSquareBracket, // ']'
  Comma, // ','
  Semicolon, // ';'
  Colon, // ':'
  Minus, // '-'
  Greater, // '>'
  Plus, // '+'

  // One or more character tokens.
  // Keywords.
  If, // 'if'

  // Literals.
  Identifier,
  String,
  Number,

  // End Of File
  EOF
}

export interface TellerRuleToken {
  type: TellerRuleTokenType,
  lexeme: string
  literal: any
  line: number
}
