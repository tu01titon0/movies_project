const BaseController = require("./base.controller");
const HomeModel = require('../models/home.model');
class HomeController {
    async getHomePage(req, res) {
        let listBackGround =await HomeModel.getBackGround()
        let listTrending =await HomeModel.getTrending()
        let listPopular = await HomeModel.getPopular()
        let listRecently =await HomeModel.getRecently()
        let listAction=await HomeModel.getAction()
        let html = await BaseController.getTemplate('./src/views/home.html')
        if(listBackGround && listTrending && listPopular && listRecently && listAction && html){
            let backGround = ``
            listBackGround.forEach(element=>{
                backGround += `<div class="hero__items set-bg" data-setbg="../../public/images/${element.imgUrl}">
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="hero__text">
                                <div class="label">${element.genreNames}</div>
                                <h2>${element.movieName}</h2>
                                <p>${element.description}</p>
                                <a href="/movies-details?id=${element.movieId}"><span>Watch Now</span> <i class="fa fa-angle-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>`
            })
            let trending =``
            listTrending.forEach(element=>{
                trending += `<div class="col-lg-4 col-md-6 col-sm-6">
                                <div class="product__item">
                                    <div class="product__item__pic set-bg" data-setbg="../../public/images/${element.imgUrl}">
                                        <div class="comment"><i class="fa fa-comments"></i> 11</div>
                                        <div class="view"><i class="fa fa-eye"></i>${element.viewCount}</div>
                                    </div>
                                    <div class="product__item__text">
                                        <ul>
                                            <li>${element.genreNames}</li>
                                        </ul>
                                        <h5><a href="/movies-details?id=${element.movieId}">${element.movieName}</a></h5>
                                    </div>
                                </div>
                            </div>`
            })
            let popular=``
            listPopular.forEach(element=>{
                popular+=`<div class="col-lg-4 col-md-6 col-sm-6">
                                <div class="product__item">
                                    <div class="product__item__pic set-bg" data-setbg="../../public/images/${element.imgUrl}">
                                        <div class="comment"><i class="fa fa-comments"></i> 11</div>
                                        <div class="view"><i class="fa fa-eye"></i> ${element.viewCount}</div>
                                    </div>
                                    <div class="product__item__text">
                                        <ul>
                                            <li>${element.genreNames}</li>
                                        </ul>
                                        <h5><a href="/movies-details?id=${element.movieId}">${element.movieName}</a></h5>
                                    </div>
                                </div>
                            </div>`
            })
            let recently =``
            listRecently.forEach(element=>{
                recently +=`<div class="col-lg-4 col-md-6 col-sm-6">
                                <div class="product__item">
                                    <div class="product__item__pic set-bg" data-setbg="../../public/images/${element.imgUrl}">
                                        <div class="comment"><i class="fa fa-comments"></i> 11</div>
                                        <div class="view"><i class="fa fa-eye"></i>${element.viewCount}</div>
                                    </div>
                                    <div class="product__item__text">
                                        <ul>
                                            <li>${element.genreNames}</li>
                                        </ul>
                                        <h5><a href="/movies-details?id=${element.movieId}">${element.movieName}</a></h5>
                                    </div>
                                </div>
                            </div>`
            })
            let action=``
            listAction.forEach(element=>{
                action+=`<div class="col-lg-4 col-md-6 col-sm-6">
                                <div class="product__item">
                                    <div class="product__item__pic set-bg" data-setbg="../public/images/${element.imgUrl}">
                                        <div class="comment"><i class="fa fa-comments"></i> 11</div>
                                        <div class="view"><i class="fa fa-eye"></i>${element.viewCount}</div>
                                    </div>
                                    <div class="product__item__text">
                                        <ul>
                                            <li>${element.genreNames}</li>
                                        </ul>
                                        <h5><a href="/movies-details?id=${element.movieId}">${element.movieName}</a></h5>
                                    </div>
                                </div>
                            </div>`
            })
            res.writeHead(200, {'Content-type': 'text/html'});
            if(req.user){
                html=html.replace(`userName">`,'userName">' + req.user.email)
            }
            html=html.replace(`{background}`,backGround)
            html=html.replace(`{trending}`,trending)
            html=html.replace(`{popular}`,popular)
            html=html.replace(`{recently}`,recently)
            html=html.replace(`{action}`,action)
            res.write(html);
        }else {
            res.writeHead(301, { Location: '/notfound' });
        }
        return res.end();
    }
}
module.exports = new HomeController()