const Stage = require('telegraf/stage')
const I18n = require('telegraf-i18n')
const {
  handleStart
} = require('../handlers')

const { match } = I18n

const messaging = require('./messaging')
const sceneNewPack = require('./pack-new')
const originalSticker = require('./sricker-original')
const packEdit = require('./admin-pack')

const stage = new Stage([].concat(
  sceneNewPack,
  originalSticker,
  messaging,
  packEdit
))

stage.use((ctx, next) => {
  if (!ctx.session.scene) ctx.session.scene = {}
  return next()
})

stage.hears(([
  '/cancel',
  match('scenes.btn.cancel')
]), async (ctx) => {
  ctx.session.scene = null
  await ctx.reply(ctx.i18n.t('scenes.leave'), {
    reply_to_message_id: ctx.message.message_id
  })
  ctx.scene.leave()
  handleStart(ctx)
})

stage.hears(([
  '/start',
  '/packs',
  '/inline',
  '/anim',
  '/video',
  match('cmd.start.btn.packs'),
  match('cmd.start.btn.inline'),
  match('cmd.start.btn.anim'),
  match('cmd.start.btn.video')
]), async (ctx, next) => {
  ctx.session.scene = null
  ctx.scene.leave()
  await next()
})
stage.middleware()

module.exports = stage
