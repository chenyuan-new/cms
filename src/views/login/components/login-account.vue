<template>
  <div class="login-account">
    <el-form label-width="60px" :rules="rules" :model="account" ref="formRef">
      <el-form-item label="账号" prop="name">
        <el-input v-model="account.name" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="account.password" type="password" show-password />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ref } from 'vue'
import { rules } from '../config/account-config'

const account = ref({
  name: '',
  password: '',
})

const formRef = ref<FormInstance>()

const loginAction = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      console.log('valid')
    } else {
      console.log('invalid')
    }
  })
}

defineExpose({
  loginAction,
})
</script>

<style scoped lang="less"></style>
