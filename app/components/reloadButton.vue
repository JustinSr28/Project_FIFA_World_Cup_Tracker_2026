<template>
    <button @click="$emit('reload')" :disabled="loading" class="reload-btn"> {{ loading ? "Cargando..." : "Volver a cargar" }} </button>
</template>

<script setup>

defineProps({
    loading: {
        type: Boolean,
        default: false
    }
})
defineEmits(["reload"])
</script>

<style scoped>
.reload-btn {
    align-self: flex-start;
    background: #f1f5f9;
    color: #334155;
    border: 1px solid #cbd5e1;
    padding: 12px 25px;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
    transition: .2s ease;
    margin-left: 5px;
}
.reload-btn:hover {
    background: #e2e8f0;
    border-color: #94a3b8;
    transform: translateY(-2px);
}
.reload-btn:disabled {
    opacity: .6;
    cursor: not-allowed;
}
</style>