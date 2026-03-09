export default defineStore('updateData', () => {
    const spinning = ref(false);
    const Setspinning = (val: boolean) => {
        spinning.value = val;
    };
    const open = ref(false);

    return {
        spinning,
        Setspinning,
        open,
    };
});
