export const formatRut = (value: string) => {
  const cleaned = value.replace(/[^0-9kK]/g, "").toUpperCase();

  if (cleaned.length <= 1) return cleaned;

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);

  const formattedBody = body
    .split("")
    .reverse()
    .reduce((acc, char, index) => {
      return char + (index > 0 && index % 3 === 0 ? "." : "") + acc;
    }, "");

  return `${formattedBody}-${dv}`;
};

export const validateRut = (rut: string) => {
  const cleaned = rut.replace(/\./g, "").replace("-", "").toUpperCase();

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expected = 11 - (sum % 11);

  const dvFinal =
    expected === 11 ? "0" : expected === 10 ? "K" : expected.toString();

  return dvFinal === dv;
};