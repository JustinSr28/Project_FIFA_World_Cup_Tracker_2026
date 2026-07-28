<script setup>

const { loginGoogle } = useAuth()

const login = async () => {
  await loginGoogle()

  navigateTo("/dashboard")
}
</script>
<template>

<div class="login-page">


  <div class="login-card">


    <h1>Iniciar sesión</h1>

   

    <button
      @click="login"
      class="google-btn"
    >

      <span class="google-icon">
        G
      </span>

      Iniciar sesión con Google

    </button>


  </div>


</div>

</template>


<style scoped>

.login-page {

  min-height:100vh;

  display:flex;
  justify-content:center;
  align-items:center;

  background:#f8fafc;

}



.login-card {

  width:380px;

  background:white;

  padding:3rem;

  border-radius:24px;

  text-align:center;


  border:1px solid #e2e8f0;

  box-shadow:
  0 20px 50px rgba(15,23,42,.08);

}



.login-card h1 {

  margin-bottom:2rem;

  color:#0f172a;

  font-size:2rem;

}



.google-btn {

  width:100%;

  padding:0.9rem 1.2rem;


  border-radius:12px;

  border:1px solid #d1d5db;


  background:white;

  color:#334155;


  font-size:1rem;

  font-weight:600;


  cursor:pointer;


  display:flex;

  align-items:center;

  justify-content:center;

  gap:12px;


  transition:.25s;

}



.google-btn:hover {

  background:#f8fafc;

  border-color:#94a3b8;

  transform:translateY(-2px);

  box-shadow:
  0 8px 18px rgba(0,0,0,.08);

}



.google-icon {

  width:32px;

  height:32px;


  border-radius:50%;


  background:#f1f5f9;


  display:flex;

  align-items:center;

  justify-content:center;


  color:#4285f4;


  font-weight:700;

}



</style>