const TronWeb = require('tronweb');

class Tron {

    constructor(node, apikey) {
        const HttpProvider = TronWeb.providers.HttpProvider;
        const fullNode = new HttpProvider(node);
        this.mainTronWeb = new TronWeb(fullNode, fullNode, fullNode);
		this.mainTronWeb.setHeader({ "TRON-PRO-API-KEY": apikey });
    }

    async coinBalance(address) {
        try{
            const balanceInSun = await this.mainTronWeb.trx.getBalance(address);
            const balanceInTRX = this.mainTronWeb.fromSun(balanceInSun);
            return nResult(balanceInTRX);
        }
        catch(e){
			return nError(e);
        }
    }

    async tokenBalance(token, address) {
        try{
            const tokenContract = await this.mainTronWeb.contract().at(token);
            const balanceWei = await tokenContract.balanceOf(address).call();
            const decimal = await tokenContract.decimals().call();
            const balanceInToken = this.mainTronWeb.fromSun( balanceWei.div( Math.pow( 10, decimal ) ) );
            return nResult(balanceInToken);
        }
        catch(e){
			return nError(e);
        }
    } 

    async totalSupply(token) {
        try{
            const tokenContract = await this.mainTronWeb.contract().at(token);
            const totalSupplyInWei = await tokenContract.totalSupply().call();
            let totalSupply =  this.mainTronWeb.fromSun(totalSupplyInWei);
            return nResult(totalSupply);
        }
        catch(e){
			return nError(e);
        }
    }   
     
}
module.exports = Tron;

function nError(e) {
    const response = {
        result: false,
        message: e
    };	
    return response;    
}

function nResult(r) {
    const response = {
        result: true,
        message: r
    };	
    return response;    
}

function toPlainNum(num) {
    return (''+ +num).replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/,
    function(a,b,c,d,e) {
    return e < 0
        ? b + '0.' + Array(1-e-c.length).join(0) + c + d
        : b + c + d + Array(e-d.length+1).join(0);
    });
}