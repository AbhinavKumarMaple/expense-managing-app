export const fetchIconImageFilenames = async () => {
  const context = require.context(
    '../assets/icons',
    false,
    /\.(png|jpe?g|gif|svg)$/,
  );
  return context.keys().map(context);
};
