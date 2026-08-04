<template>
    <ReloadButton :loading="loading" @reload="loadUser" />
    <form @submit.prevent="guardarPerfil" class="profile-form">
     
        <div class="form-grupo profile-photo">
            <label>Foto de perfil</label>
            <div class="profile-image">
                <img :src="userFirestore?.photo" :alt="userFirestore?.name">
            </div>
        </div>
        
        <div class="form-grupo">
            <label>Nombre </label>
            <input v-model="formulario.name" type="text" placeholder="Ingrese su nombre">
        </div>
        
        <div class="form-grupo">
            <label>Correo</label>
            <input :value="userFirestore?.email" type="email" disabled>
        </div>
        
    
        <div class="form-acciones">
            <button type="submit" class="btn-primary"> Guardar cambios  </button>
        </div>

    </form>
</template>

<script setup>
const {user} = useAuth()
const {user: userFirestore,loadUser,editUser} = useUsers()
const formulario = ref({ name: ""})

watch(
    user,
    async (newUser) => {
        if (!newUser) return
        await loadUser(newUser.uid)
        if (userFirestore.value) {
            formulario.value.name = userFirestore.value.name
        }
    },
    {
        immediate: true
    }
)

const guardarPerfil = async () => {
    await editUser(
        userFirestore.value.id,
        {
            name: formulario.value.name
        }
    )
}

</script>

<style scoped>
.profile-form {
    max-width: 650px;
    margin: 40px auto;
    padding: 35px;
    background: #ffffff;
    border-radius: 20px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 15px 35px rgba(15, 23, 42, .08);
    font-family: 'Inter', sans-serif;
}

.form-grupo {
    display: flex;
    flex-direction: column;
    gap: 9px;
    margin-bottom: 22px;
}
.form-grupo label {
    color: #334155;
    font-size: .9rem;
    font-weight: 600;
}

.form-grupo input {
    padding: 13px 15px;
    border-radius: 10px;
    border: 1px solid #cbd5e1;
    background: #ffffff;
    color: #0f172a;
    font-size: .95rem;
    font-family: 'Inter', sans-serif;
    transition: .25s;
}
.form-grupo input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, .15);
}

.form-grupo input:disabled {
    background: #f1f5f9;
    color: #64748b;
    cursor: not-allowed;
    border-color: #e2e8f0;
}

.profile-photo {
    align-items: center;
}
.profile-photo label {
    align-self: flex-start;
}
.profile-image {
    display: flex;
    justify-content: center;
    margin: 18px 0 25px;
}
.profile-image img {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #dbeafe;
    padding: 3px;
    background: white;
    box-shadow: 0 8px 20px rgba(37, 99, 235, .15);
}

.form-acciones {
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
}
.btn-primary {
    padding: 13px 25px;
    border-radius: 10px;
    border: none;
    background: #2f3f63;
    color: white;
    font-family: 'Inter', sans-serif;
    font-size: .95rem;
    font-weight: 600;
    cursor: pointer;
    transition: .25s;
}
.btn-primary:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, .25);
}
</style>