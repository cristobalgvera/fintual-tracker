export type AccessTokenResponse = {
  data: {
    type: 'access_token';
    attributes: {
      token: string;
    };
  };
};
