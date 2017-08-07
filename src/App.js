import React, {Component} from 'react';
import ReactDom from 'react-dom';
//import logo from './logo.svg';
import './App.css';
import imgData from './images_data.json';


imgData.forEach(function (value) {
    value.imgUrl = './' + value.path;
});

var ImgFigure = React.createClass({
    //点击处理函数
    handleClick: function(event) {
        console.log(this.props);
        if (this.props.arrange.isCenter) {
            this.props.inverse();
        }
        else this.props.center();
        event.stopPropagation();
        event.preventDefault();
    },
    render: function() {
        var styleObj = {};
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }
        if (this.props.arrange.rotate) {
            styleObj.transform = 'rotate(' + this.props.arrange.rotate + 'deg)';
        }
        var imgFigureClass = 'photo-figure';
        if (this.props.arrange.isInverse) {
            imgFigureClass += ' photo-inverse';
        }
        else imgFigureClass += '';
        return (
            <figure className={imgFigureClass} style={styleObj}>
                <img className="img-ctrl" src={this.props.data.imgUrl} alt="Img" onClick={this.handleClick}/>
                <figcation className="photo-title">
                    <h4>{this.props.data.title}</h4>
                    <div className="img-back" onClick={this.handleClick}>
                        <p>{this.props.data.desc}</p>
                    </div>
                </figcation>
            </figure>
        )
    }
})
//获取区间的随机值
function getRangeRandom(low, height) {
    return Math.ceil(Math.random() * (height - low) + low);
}
//生成随机角度值
function getRandomDeg() {
    return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30)
}
class PhotoWallApp extends Component {
    constructor(props) {
        super(props);
        this.Constant = {
            centerPos: {
                left: 0,
                right: 0,
                zIndex: 10
            },
            hPosRange: {
                y: [0, 0],
                leftSecX: [0, 0],
                rightSecX: [0, 0]
            },
            vPosRange: {
                topY: [0, 0],
                x: [0, 0]
            }
        };
        this.state = {
            imgArrangeArr: [
                {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                }
            ]
        };

    };
    /*
     *在ES6中不支持了
     *  */
    /*getInitialState() {
     return {
     imgArrangeArr: [
     {
     pos: {
     left: '0',
     top: '0'
     }
     }
     ]
     }
     }*/
    rearrangeImg(centerIndex) {
        var imgArrangeArr = this.state.imgArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosLeftSecX = hPosRange.leftSecX,
            hPosRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,

            imgArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2),
            topImgSpliceIndex = 0,
            centerImg = imgArrangeArr.splice(centerIndex, 1)[0];
        centerImg.pos = centerPos;
        centerImg.rotate = 0;
        centerImg.isCenter = true;
        //获取要布局在上侧的图片信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgArrangeArr.length - topImgNum));
        imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex, topImgNum);
        //布局位于顶部的图片
        imgArrangeTopArr.forEach(function (value, index) {
            imgArrangeTopArr[index] = {
                pos: {
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: getRandomDeg(),
                isCenter: false
            }
        });
        //布局左右两侧的图片
        for (var i = 0, j = imgArrangeArr.length, k = j / 2; i < j; i++) {
            var hPosRangeLR = null;
            //前半部分布局左边，后半部分布局右边
            if (i < k) {
                hPosRangeLR = hPosLeftSecX;
            }
            else hPosRangeLR = hPosRightSecX;
            imgArrangeArr[i] = {
                pos: {
                    top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLR[0], hPosRangeLR[1])
                },
                rotate: getRandomDeg(),
                isCenter: false
            }
        }
        if (imgArrangeTopArr && imgArrangeTopArr[0]) {
            imgArrangeArr.splice(topImgSpliceIndex, 0, imgArrangeTopArr[0]);
        }
        imgArrangeArr.splice(centerIndex, 0, centerImg);
        console.log(imgArrangeArr);
        this.setState({mgArrangeArr: imgArrangeArr});

    }
    inverseImg(index) {
        return function() {
            var imgArrangeArr = this.state.imgArrangeArr;
            imgArrangeArr[index].isInverse = !imgArrangeArr[index].isInverse;
            this.setState({imgArrangeArr: imgArrangeArr});
        }.bind(this)
    }
    componentDidMount() {
        //获取舞台的的宽高
        let stageDom = ReactDom.findDOMNode(this.refs.stage);
        let stageW = stageDom.scrollWidth;
        let stageH = stageDom.scrollHeight;
        let halfStageW = Math.ceil(stageW / 2);
        let halfStageH = Math.ceil(stageH / 2);
        //获取imgFigure的大小
        let imgFigureDom = ReactDom.findDOMNode(this.refs.imgFigure0),
            imgWidth = imgFigureDom.scrollWidth,
            imgHeight = imgFigureDom.scrollHeight,
            halfImgWidth = Math.ceil(imgWidth / 2),
            halfImgHeight = Math.ceil(imgHeight / 2);
        //计算图片排布位置
        this.Constant.centerPos.left = halfStageW - halfImgWidth;
        this.Constant.centerPos.top = halfStageH - halfImgHeight * 2;
        //左右两侧布局范围
        this.Constant.hPosRange.leftSecX[0] = -halfImgWidth;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgWidth * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgWidth;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgWidth;
        this.Constant.hPosRange.y[0] = -halfImgHeight;
        this.Constant.hPosRange.y[1] = stageH - halfImgHeight;
        //顶部布局范围
        this.Constant.vPosRange.topY[0] = -halfImgHeight;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgHeight * 4;
        this.Constant.vPosRange.x[0] = halfStageW - imgWidth;
        this.Constant.vPosRange.x[1] = halfStageW;
        var index = Math.floor(Math.random() * imgData.length);
        this.rearrangeImg(index);
       // this.rearrangeImg(0);

    };
    centerImg(index) {
        return function () {
            this.rearrangeImg(index);
        }.bind(this)
    }
    render() {
        var controllerUnits = [],
            imgFigures = [];
        imgData.forEach(function (value, index) {
            if (!this.state.imgArrangeArr[index]) {
                this.state.imgArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                }
            }
            imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} arrange={this.state.imgArrangeArr[index]}
            inverse={this.inverseImg(index)} center={this.centerImg(index)}/>)
        }.bind(this));
        return (
            <div className="content">
                <div className="stage" ref="stage">
                    <div className="image-area">
                        {imgFigures}
                    </div>
                    <nav className="controller-nav">
                        {controllerUnits}
                    </nav>
                </div>
            </div>
        );
    };
}

export default PhotoWallApp;
