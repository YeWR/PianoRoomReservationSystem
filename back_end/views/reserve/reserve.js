const Router = require("koa-router");
const router = new Router();
const dataBase = require("../dataBase")

const routers = router.get("/all", async (ctx, next) => {
    let result = await dataBase.GetPianoRoomInfo(pianoId);
    console.log(result);
    ctx.response.body = result;

}).get("/detail", async (ctx, next) => {
    let pianoId = ctx.request.body.pianoId;
    let result = await dataBase.GetPianoRoomInfo(pianoId);
    if(result.data === null)
    {
        ctx.response.body = {"tableTime": null, "pianoPrices": null, "pianoInfo": null, "errorMsg":result.info};
    }
    console.log(result);
    ctx.response.body = result;
});

module.exports = routers;