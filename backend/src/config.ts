export const config = () => {
  console.log(process.env.DATABASE_NAME);
  return {
    port: process.env.PORT || 3000,
    clientUrl: process.env.CLIENTURL,
    apiUrl: process.env.APIURL,
    jwt: {
      secret: process.env.SECRET,
    },
    database: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: +process.env.DATABASE_PORT || 5432,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    },
  };
};
