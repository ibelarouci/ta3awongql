const { gql } = require('apollo-server');

const typeDefs = gql`
type Query {
  # This query will be protected so only authenticated users can access it
  getAllFarm : [Farm]
  getFarmByOwner (ownerId : String):[Farm]
  getHarvestByFarm (farmsId : [ObjectIdInput] ):[Harvest]
  getHarvestByOwner (ownerId : String ):[Harvest]
  getAllHarvestDetails :[HarvestDetail]
  
}
type User {
    farms: [Farm]
  }

type Farm { 
    id: ID!
    title: String
    address: String
    owner : User 
    disable:Boolean
    
}


type  Harvest {
        id:ID!
        harvestDetail:HarvestDetail
        startDate:String
        harvestDate:String
        harvestCycle:Int
        farmHarvest:Farm
        harvestQuantity:Float
        firstApprovation:Approvation
        secondApprovation:Approvation
        disable:Boolean
    }
    
type Mutation {
      addFarm(title: String, address: String): Farm
      addHarvest(fields:HarvestInput): Harvest
      addHarvestDetail ( title:String ): HarvestDetail

      approvateHarvestDetail(harvestDetailId:String, approvation:ApprovationInput):HarvestDetail
      firstApprovateHarvest(harvestId:String,approvation:ApprovationInput):Harvest 
      secondApprovateHarvest(harvestId:String,approvation:ApprovationInput):Harvest
      fusionHarvestDetail (harvestDetailId1 : String , harvestDetailId2 : String ):Int
      
      updateFarm(farmId:String, title: String, address: String):Farm
      updateHarvest (harvestId:String, fields:HarvestInput):Harvest
      updateHarvestDetail (harvestDetailId:String , title: String):HarvestDetail
      
      disableFarm (farmId:String,disable:Boolean):Boolean
      disableHarvest ( harvestId:String,disable:Boolean):Boolean
      disableHarvestDetail (harvestDetailId:String,disable:Boolean):Boolean


    }

type HarvestDetail {
    id:ID!
    title:String
    approvation:Approvation
    disable:Boolean
}
input HarvestInput {
    harvestDetail:String
    startDate:String
    harvestDate:String
    harvestCycle:Int
    farmHarvest:String
    harvestQuantity:Float
}
type Approvation {
    by: User!
    date:String!
    state:Boolean
    comment:String 
}
input ApprovationInput {
    by: String
    date:String
    state:Boolean
    comment:String 
}
input ObjectIdInput {
    id:ID!
}
input FarmsInput {
    FarmsId:[String]
}
`;

module.exports = typeDefs;