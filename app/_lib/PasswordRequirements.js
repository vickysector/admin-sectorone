export const CheckPasswordRequirements = (password) => {
  const minLength = 8;
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);
  const hasCapitalLetter = /[A-Z]/.test(password);
  const isLengthValid = password.length >= minLength;

  return {
    passwordRequirement:
      isLengthValid && hasNumber && hasSymbol && hasCapitalLetter,
  };
};
