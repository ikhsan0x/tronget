const TronWeb = require('tronweb');

class Tron {

    constructor(apikey) {
        const node = "https://api.trongrid.io";
        this.mainTronWeb = new TronWeb(node, node, node);
        this.mainTronWeb.setHeader({
            "TRON-PRO-API-KEY": apikey
        });
    }

    async coinBalance(address) {
        try {
            const balanceInSun = await this.mainTronWeb.trx.getBalance(address);
            const balanceInTRX = this.mainTronWeb.fromSun(balanceInSun);
            return nResult(balanceInTRX);
        }
        catch (e) {
            return nError(e);
        }
    }

    async tokenBalance(token, address) {
        try {
            this.mainTronWeb.setAddress(address);
            const tokenContract = await this.mainTronWeb.contract().at(token);
            const balanceWei = await tokenContract.balanceOf(address).call();
            const decimal = await tokenContract.decimals().call();
            const balanceFromWei = toPlainNum( this.mainTronWeb.toBigNumber(balanceWei) )
            const balanceInToken = balanceFromWei / Math.pow(10, decimal);
            return nResult(balanceInToken);
        }
        catch (e) {
            return nError(e);
        }
    }

    async totalSupply(token) {
        try {
            this.mainTronWeb.setAddress(token);
            const tokenContract = await this.mainTronWeb.contract().at(token);
            const totalSupplyInWei = await tokenContract.totalSupply().call();
            const decimal = await tokenContract.decimals().call();
            let balanceFromWei = toPlainNum( this.mainTronWeb.toBigNumber(totalSupplyInWei) )
            let totalSupply = balanceFromWei / Math.pow(10, decimal);
            return nResult(totalSupply);
        }
        catch (e) {
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
