const passport = require('../libs/passport');
const config = require('../config');
const uuid = require('uuid/v4');

module.exports.oauth = async function oauth(ctx, next) {
  const provider = ctx.params.provider;

  await passport.authenticate(
      provider,
      config.providers[provider].options,
  )(ctx, next);

  ctx.status = 200;
  ctx.body = {status: 'Ok', location: ctx.response.get('location')};
};

module.exports.oauthCallback = async function oauthCallback(ctx, next) {
  const provider = ctx.request.body.provider;

  await passport.authenticate(provider, async (err, user, info) => {
    if (err) throw err;

    if (!user) {
      ctx.status = 400;
      ctx.body = {error: info};
      return;
    }

    const token = uuid();

    ctx.body = {token};
  })(ctx, next);
};
