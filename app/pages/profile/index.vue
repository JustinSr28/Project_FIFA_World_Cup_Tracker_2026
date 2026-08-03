<template>
  <form 
    @submit.prevent="guardarPerfil"
    class="profile-form"
>


    <!-- FOTO -->
    <div class="form-grupo profile-photo">


        <label>
            Foto de perfil
        </label>


        <div class="profile-image">

            <img
                :src="userFirestore?.photo"
                :alt="userFirestore?.name"
            >

        </div>


    </div>



    <!-- NOMBRE EDITABLE -->
    <div class="form-grupo">


        <label>
            Nombre *
        </label>


        <input
            v-model="formulario.name"
            type="text"
            placeholder="Ingrese su nombre"
        >


    </div>




    <!-- EMAIL BLOQUEADO -->
    <div class="form-grupo">


        <label>
            Correo
        </label>


        <input
            :value="userFirestore?.email"
            type="email"
            disabled
        >


    </div>




    <!-- FOTO GOOGLE -->
    <div class="form-grupo">


        <label>
            Foto Google
        </label>


        <input
            :value="userFirestore?.photo"
            disabled
        >


    </div>




    <!-- PUNTOS -->
    <div class="form-grupo">


        <label>
            Puntos
        </label>


        <input
            :value="userFirestore?.points"
            type="number"
            disabled
        >


    </div>




    <!-- UID -->
    <div class="form-grupo">


        <label>
            UID
        </label>


        <input
            :value="userFirestore?.uid"
            disabled
        >


    </div>




    <!-- BOTONES -->
    <div class="form-acciones">


        <button
            type="submit"
            class="btn-primary"
        >

            Guardar cambios

        </button>


    </div>


</form>
</template>

<script setup>

const {
    user
} = useAuth()


const {
    user: userFirestore,
    loadUser,
    editUser
} = useUsers()


const formulario = ref({
    name: ""
})


watch(
    user,
    async (newUser)=>{
        if(!newUser) return
        await loadUser(newUser.uid)
        if(userFirestore.value){
            formulario.value.name = userFirestore.value.name
        }
    },
    {
        immediate:true
    }
)

const guardarPerfil = async()=>{
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

    max-width: 600px;
    margin: 30px auto;
    padding: 25px;

    background: white;

    border-radius: 15px;

    box-shadow: 0 5px 20px rgba(0,0,0,.1);

}



.form-grupo {

    display: flex;

    flex-direction: column;

    gap: 8px;

    margin-bottom: 20px;

}



.form-grupo label {

    font-weight: 600;

    color: #333;

}



.form-grupo input {

    padding: 12px;

    border-radius: 8px;

    border: 1px solid #ddd;

    font-size: 15px;

}



.form-grupo input:disabled {

    background: #f1f1f1;

    cursor: not-allowed;

    color: #666;

}




.profile-image {

    display: flex;

    justify-content: center;

    margin: 15px 0;

}



.profile-image img {

    width: 120px;

    height: 120px;

    border-radius: 50%;

    object-fit: cover;

    border: 3px solid #ddd;

}




.form-acciones {

    display: flex;

    justify-content: flex-end;

    gap: 15px;

    margin-top: 25px;

}



.btn-primary,
.btn-secondary {

    padding: 12px 20px;

    border-radius: 8px;

    border: none;

    cursor: pointer;

    font-weight: 600;

}



.btn-primary {

    background: #2563eb;

    color: white;

}

.btn-secondary {

    background: #e5e7eb;

    color: #333;

}



.btn-primary:hover {

    opacity: .9;

}



.btn-secondary:hover {

    opacity: .9;

}


</style>