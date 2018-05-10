//StateInfo Class Definition that contains state attributes
class StateInfo{
    constructor(){
        this.name = ""
        this.code = ""
        this.totalPopulation = 0
        this.totalPopulationInPoverty = 0
        this.totalPopulationInPovertyAge0to17 = 0
        this.unInsuredMotoristPercentage = ""
        this.unInsuredMotoristTotal = ""
        this.provertyPopulationPercentage = ""
    }

    
}

//local variables declaration
var objPoverty;
var objStatePopulation;
var objStateInfo;
var objUnInsuredByState;
var aStateInfo = new Array();
var totalNationwidePovertyAge0to17 = 0; 
var meanNationwidePovertyAge0to17 = 0; 

//get data for state_info, population, uninsured_by_state and poverty.
//combine the data based on State Code or State Description.
//state_info: local json object to keep state code and state description to combine data from different sources
//              based on name and code. 
//population: remote json object with states code and population
//uninsured_by_state: local json object with states description and uninsured motorist percentage
//poverty: remote json object with states code, population in poverty and population in poverty Age 0 to 17
//retrieve data and wait till all the objects are available to process them further in then.
$.when(

    
    $.getJSON('../data/state_info.json', function(response){
       objStateInfo = response;
    }),
    $.getJSON('https://static.withhugo.com/tests/data/population.json', function(response){
       objStatePopulation = response;
    }),
    $.getJSON('../data/uninsured_by_state.json', function(response){
       objUnInsuredByState = response;
    }),
    $.getJSON('https://static.withhugo.com/tests/data/poverty.json', function(response){
       objPoverty = response;
    })

).then(function() {

    // All the objects are ready now
    //Commented code can be use later for debugging if the objects are not coming properly.
    //console.log(objStateInfo);
    //console.log(objStatePopulation);
    //console.log(objUnInsuredByState);
    //console.log(objPoverty);

    //traverse StateInfo JSON object, combine all four objects into local StateInfo object. 
    for (var key in objStateInfo) {
      if (objStateInfo.hasOwnProperty(key)) {
        var locStateInfo = new StateInfo();
        locStateInfo.name = objStateInfo[key].name;
        locStateInfo.code = objStateInfo[key].code;
        
        if(objStatePopulation != null && objStatePopulation != '' && objStatePopulation[objStateInfo[key].code] != null)
            locStateInfo.totalPopulation = objStatePopulation[objStateInfo[key].code];   

        if(objPoverty != null && objPoverty != '' && objPoverty[objStateInfo[key].code] != null){
            locStateInfo.totalPopulationInPoverty = objPoverty[objStateInfo[key].code].total;
            locStateInfo.totalPopulationInPovertyAge0to17 = objPoverty[objStateInfo[key].code].age0to17;
            totalNationwidePovertyAge0to17 += objPoverty[objStateInfo[key].code].age0to17;
        }

        if(objUnInsuredByState != null && objUnInsuredByState != '' && objUnInsuredByState.data[objStateInfo[key].name] != null)
            locStateInfo.unInsuredMotoristPercentage = objUnInsuredByState.data[objStateInfo[key].name];   

        if(locStateInfo.totalPopulation != '' && locStateInfo.unInsuredMotoristPercentage != '')
            locStateInfo.unInsuredMotoristTotal = (locStateInfo.totalPopulation * (locStateInfo.unInsuredMotoristPercentage/100));//.toFixed(2);

        if(locStateInfo.totalPopulation != '' && locStateInfo.totalPopulationInPoverty != '')
            locStateInfo.provertyPopulationPercentage = ((locStateInfo.totalPopulationInPoverty/locStateInfo.totalPopulation) * 100);//.toFixed(2);

        aStateInfo.push(locStateInfo);      
        //var val = objStateInfo[key].name;
        //console.log(val);
      }
    }

    meanNationwidePovertyAge0to17 = (totalNationwidePovertyAge0to17/aStateInfo.length);//.toFixed(2);

    /*Commented Console log methods can be enabled for debugging
    console.log(getStateWithHighestPopulationInPoverty());
    console.log(getTop3UnInsuredPopulationBySize());
    console.log(getStateWithHighestPercentageInPoverty());
    console.log(meanNationwidePovertyAge0to17);
    console.log(getStatePoverty0to17ClosestToNationalMean());
     console.log(aStateInfo);
    */

    //Check if the caller view page implements the function 
    //This function is needed by UI to refresh or bind the elements from this JS file.
    if (typeof updateUIElements == 'function') { 
      updateUIElements(); 
    } else {
        console.log('updateUIElements() function is not implemented on the page.');
    }

});

//Get the Array of StateInfo object, that contains combination of StateInfo, State Population, Poverty, UnInsured Drivers JSON objects.
function getStateInfo(){
    return aStateInfo;
}

//Get the Sorted array from Highest Population In Poverty to Lowest, pass topN parameter to select top N highest
function getStateWithHighestPopulationInPoverty(topN){
    var x = Array.prototype.slice.call(aStateInfo).sort(function(obj1, obj2) {
    return obj2.totalPopulationInPoverty - obj1.totalPopulationInPoverty;
    }).slice(0,topN);
    return x;
}

//Get the Sorted array from Highest UnInsured Population to Lowest, pass topN parameter to select top N highest
function getTop3UnInsuredPopulationBySize(topN){
    var x = Array.prototype.slice.call(aStateInfo).sort(function(obj1, obj2) {
    return obj2.unInsuredMotoristTotal - obj1.unInsuredMotoristTotal;
    }).slice(0,topN);//top 3
    return x;
}

//Get the Sorted array from Highest Population Percentage In Poverty to Lowest, pass topN parameter to select top N highest
function getStateWithHighestPercentageInPoverty(topN){
    var x = Array.prototype.slice.call(aStateInfo).sort(function(obj1, obj2) {
    return obj2.provertyPopulationPercentage - obj1.provertyPopulationPercentage;
    }).slice(0,topN);
    return x;
}

//Get the Sorted array from Closest State Poverty Age 0 to 17 from National Poverty Age 0 to 17 Mean, pass topN parameter to select top N highest
function getStatePoverty0to17ClosestToNationalMean(topN){
    var x = Array.prototype.slice.call(aStateInfo).sort(function(obj1, obj2) {
    return Math.abs(meanNationwidePovertyAge0to17 - obj1.totalPopulationInPovertyAge0to17) - Math.abs(meanNationwidePovertyAge0to17 - obj2.totalPopulationInPovertyAge0to17);
    }).slice(0,topN);
    return x;
}

//Get National Poverty Mean for Age 0 to 17
function getNationalMeanForPoverty0to17(){
    return meanNationwidePovertyAge0to17;
}




