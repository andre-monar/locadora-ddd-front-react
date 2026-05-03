export const formatCPF = (value) => {
  const nums = value.replace(/\D/g, '').slice(0, 11); // só números, máx 11
  return nums
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const formatCelular = (value) => {
  let nums = value.replace(/\D/g, '').slice(0, 11); // máx 11
  if (nums.length <= 2) return nums;
  if (nums.length <= 7) return `(${nums.slice(0,2)}) ${nums.slice(2)}`;
  return `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7)}`;
};

export const formatCep = (value) => {
    let nums = value.replace(/\D/g, '').slice(0,8);
    if (nums.length <= 5) return nums;
    return `${nums.slice(0,5)}-${nums.slice(5)}`;
}
