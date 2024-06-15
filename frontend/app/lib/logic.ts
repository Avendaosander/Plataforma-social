export const formatGraphQLErrors = (errors: any[]) => {
  return errors.map((error) => `${error.message}`).join(', ');
}