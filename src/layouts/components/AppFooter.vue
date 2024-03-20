<script setup lang="ts">

</script>

<template>
  <footer>
    <div style="text-align: center">
      <p>For wx, my good good bro.</p>
      <p>
        {{$t('footer.pr')}} >
        <a class="git" target="_blank" href="https://github.com/delongchen/good-wx">GitHub</a>
      </p>
      <p>
        <span>Copyright © 2024 Delong</span>
      </p>
    </div>
  </footer>
</template>

<style scoped lang="less">
footer {
  flex: 0;
  margin-top: 100px;
  padding-top: 20px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: #94878e;
  color: #38393a;
}

.git {
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: white;
    background-color: #38393a;
    border-radius: 4px;
  }
}
</style>
