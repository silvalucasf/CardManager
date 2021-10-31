const fs = require('fs')
const allCards = require('./json/AllCards.json')
const allPrices = require('./json/AllPrices.json')

// Analysis
let analysis = {
    totalCards: 0,
    withPrice: 0,
    withoutPrice: 0,
    priceVariation: [],
    averagePriceVariation: 0,
    maxPriceIncrease: 0,
    maxPriceDiscount: 0
}

function getFinalAllCards() {
    let finalAllCards = []

    Object.keys(allCards).forEach(cardName => {

        let card = {
            name: allCards[cardName].name,
            uuid: allCards[cardName].uuid,
            manaCost: allCards[cardName].manaCost,
            convertedManaCost: allCards[cardName].convertedManaCost,
            colorIdentity: allCards[cardName].colorIdentity,
            type: allCards[cardName].type,
            subtypes: allCards[cardName].subtypes,
            supertypes: allCards[cardName].supertypes,
            price: getPrice(allPrices[allCards[cardName].uuid].prices),
        }
    
        finalAllCards.push(card)
    })

    return finalAllCards
}

function getPrice(priceObject) {

    if(Object.keys(priceObject).length > 0) {
        let paperPrice = getPaperPrice(priceObject)
        let mtgoPrice = getMTGOPrice(priceObject)

        // Analysis
        getPriceVariation(paperPrice, mtgoPrice)

        if(paperPrice > 0) {
            analysis.withPrice++
            return paperPrice
        }
        else if(mtgoPrice > 0) {
            analysis.withPrice++
            return mtgoPrice
        }
        else {
            analysis.withoutPrice++
            return 0
        }
    } else {
        analysis.withoutPrice++
        return 0
    }

}

function getPaperPrice(priceObject) {

    let paperPrice = 0;
    let paperPriceKeys = Object.keys(priceObject.paper)

    if(paperPriceKeys.length > 0) {
        paperPrice = priceObject.paper[paperPriceKeys[paperPriceKeys.length - 1]]
    }

    return paperPrice

}

function getMTGOPrice(priceObject) {

    let mtgoPrice = 0;
    let mtgoPriceKeys = Object.keys(priceObject.mtgo)

    if(mtgoPriceKeys.length > 0) {
        mtgoPrice = priceObject.mtgo[mtgoPriceKeys[mtgoPriceKeys.length - 1]]
    }

    return mtgoPrice

}

// Analysis
function getPriceVariation(paperPrice, mtgoPrice) {

    let variation = 0
    
    if(paperPrice > 0 && mtgoPrice > 0) {
        variation = ((mtgoPrice - paperPrice) / mtgoPrice) * 100
        if(!(variation > 3000) || !(variation < -3000)) analysis.priceVariation.push(variation)
    }

    if(variation > analysis.maxPriceIncrease) analysis.maxPriceIncrease = variation
    if(variation < analysis.maxPriceDiscount) analysis.maxPriceDiscount = variation
}

module.exports = {
    getCardByUUID: function getCard(uuid) {
        const cards = require('./cards.json')
        let card = {}

        card = cards[cards.findIndex(card => card.uuid === uuid)]

        //TODO return actual object
        console.log(card)
    },
    getAllCards: function getAllCards() {
        console.log(getFinalAllCards())
    },
    storeAllCards: function storeAllCards(fileName) {

        let finalAllCards = getFinalAllCards()
    
        fs.writeFileSync(fileName, JSON.stringify(finalAllCards))
    
    },
    getAnalysis: function getAnalysis() {

        finalAllCards = getFinalAllCards()
    
        analysis.totalCards = finalAllCards.length
        analysis.averagePriceVariation = analysis.priceVariation.reduce((num1, num2) => num1 + num2, 0) / analysis.priceVariation.length
    
        delete analysis.priceVariation
    
        console.log(analysis)
    
    }
}