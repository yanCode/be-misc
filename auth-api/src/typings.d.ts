export type SmtpOptions = {
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
};

declare const process: {
  env: {
    NODE_ENV: 'production' | 'development' | 'test';
  };
};
