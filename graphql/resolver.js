const { Farm } = require('../models/farm');
const { Harvest } = require('../models/harvest');
const { HarvestDetail } = require('../models/harvestDetail');

const { AccountsServer } = require("@accounts/server");
//ObjectId = require('mongodb').ObjectID;

const resolvers = {
    User: {
        farms: async({ _id }, args, { injector }) => {
            //  const db = injector.get(Db);
            // const farms = 
            const userFarms = await Farm.find({ owner: _id });
            return userFarms
        }
    },
    Farm: {
        id: ({ _id }) => { return _id },
        owner: ({ owner }, args, { injector }) => {
            const accountsServer = injector.get(AccountsServer);
            return accountsServer.findUserById(owner);
        }
    },
    Harvest: {
        id: ({ _id }) => { return _id },
        harvestDetail: ({ harvestDetail }, args, { injector }) => {
            return HarvestDetail.findById(harvestDetail)
        },

        farmHarvest: ({ farmHarvest }, args, { injector }) => {
            return Farm.findById(farmHarvest);
        },
      // startDate: ({ startDate }, args, { injector }) => {
         //  return new Date(startDate).toDateString();

     //  },
    },
    HarvestDetail: { id: ({ _id }) => { return _id } },
    Query: {
        getAllFarm: async(root, args, { injector }) => {
            //const db = injector.get(Db);
            const farms = await Farm.find();
            return farms;

        },
        getFarmByOwner: async(root, { ownerId }, { injector, userId }) => {
            //const db = injector.get(Db);
            // const oid = ObjectId(ownerId);
            const farms = await Farm.find({ owner: ownerId });
            return farms;

        },
        getHarvestByFarm: async(root, { farmsId }, { injector, userId }) => {
            //const db = injector.get(Db);
            let fids = farmsId.map(a => a.id);
            const harvests = await Harvest.find({ farmHarvest: { $in: fids } });
            return harvests;

        },
        getHarvestByOwner: async(root, { ownerId }, { injector, userId }) => {
            //const db = injector.get(Db);
            // const oid = ObjectId(ownerId);
            const farms = await Farm.find({ owner: ownerId });
            let fids = farms.map(a => a.id);
            const harvests = await Harvest.find({ farmHarvest: { $in: fids } });
            return harvests;



        },
        getAllHarvestDetails: async(root, args, { injector, userId }) => {
            //const db = injector.get(Db);
            const hd = await HarvestDetail.find();
            return hd;

        },

    },
    Mutation: {
        /* addFarm: (root, { title, adress }, { injector, userId }) => {
            // const db = injector.get(Db);
            const Farms = Db.collection('farms');
            const { insertedId } = Farms.insertOne({ title, adress, userId: "test" });
            return insertedId;
        } */
        addFarm: async(root, { title, address }, { injector, userId }) => {
            try {
                const farm = new Farm({ title: title, address: address, owner: userId });
                const result = await farm.save();
                return {...result._doc }
            } catch (err) {
                throw err;
            }
        },
        addHarvest: async(root, { fields }, { injector }) => {
            try {
                const harvest = new Harvest({
                    harvestDetail: fields.harvestDetail,
                    startDate: fields.startDate,
                    harvestDate: fields.harvestDate,
                    harvestCycle: fields.HarvestCycle,
                    farmHarvest: fields.farmHarvest,
                    harvestQuantity: fields.harvestQuantity
                });

                const result = await harvest.save();
                return {...result._doc }
            } catch (err) {
                throw err;
            }
        },
        addHarvestDetail: async(root, { title }, { injector }) => {
            try {
                const harvestDetail = new HarvestDetail({
                    title: title,
                });

                const result = await harvestDetail.save();
                return {...result._doc }
            } catch (err) {
                throw err;
            }
        },

        approvateHarvestDetail: async(root, { harvestDetailId, approvation }, { injector, userId }) => {
            try {
                if (userId) {
                    approvation.by = userId;
                    const currentDate = new Date();
                    approvation.date = currentDate.toISOString();
                    console.log(harvestDetailId);
                    const harvestDetail = await HarvestDetail.findByIdAndUpdate(harvestDetailId, { 'approvation': approvation }, { new: true },
                        function(err, docs) {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log("Updated harvest : ", docs);
                            }
                        }
                    );

                    // const result = harvestDetail.save();
                    return {...harvestDetail._doc }
                } else throw new Error('You must authenticate!');
            } catch (err) {
                throw err;
            }
        },
        firstApprovateHarvest: async(root, { harvestId, approvation }, { injector, userId }) => {
            try {
                if (userId) {
                    approvation.by = userId;
                    const currentDate = new Date();
                    approvation.date = currentDate.toISOString();
                    //console.log(harvestDetailId);
                    const harvest = await Harvest.findByIdAndUpdate(harvestId, { 'firstApprovation': approvation }, { new: true },
                        function(err, docs) {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log("Updated harvest : ", docs);
                            }
                        }
                    );

                    // const result = harvestDetail.save();
                    return {...harvest._doc }
                } else throw new Error('You must authenticate!');
            } catch (err) {
                throw err;
            }
        },
        secondApprovateHarvest: async(root, { harvestId, approvation }, { injector, userId }) => {
            try {
                if (userId) {
                    approvation.by = userId;
                    const currentDate = new Date();
                    approvation.date = currentDate.toISOString();
                    //console.log(harvestDetailId);
                    const harvest = await Harvest.findByIdAndUpdate(harvestId, { 'secondApprovation': approvation }, { new: true },
                        function(err, docs) {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log("Updated harvest : ", docs);
                            }
                        }
                    );

                    // const result = harvestDetail.save();
                    return {...harvest._doc }
                } else throw new Error('You must authenticate!');
            } catch (err) {
                throw err;
            }
        },

        fusionHarvestDetail: async(root, { harvestDetailId1, harvestDetailId2 }, { injector, userId }) => {
            try {
                const harvest = await Harvest.updateMany({ harvestDetail: harvestDetailId2 }, { $set: { harvestDetail: harvestDetailId1 } }, { timestamps: false });
                const harvestDetail = await HarvestDetail.findOneAndUpdate(harvestDetailId2, { $set: { disable: true } }, { timestamps: false });

                return harvest.nModified
            } catch (err) {
                throw err;
            }
        },

        updateFarm: async(root, { farmId, title, address }, { injector, userId }) => {
            try {
                const farm = await Farm.findByIdAndUpdate(farmId, { title: title, address: address }, { new: true });
                //const result = await farm.save();
                return {...farm._doc }
            } catch (err) {
                throw err;
            }
        },
        updateHarvest: async(root, { harvestId, fields }, { injector, userId }) => {
            try {
                const harvest = await Harvest.findByIdAndUpdate(harvestId, { $set: fields }, { new: true });

                return {...harvest._doc }
            } catch (err) {
                throw err;
            }
        },
        updateHarvestDetail: async(root, { harvestDetailId, title }, { injector, userId }) => {
            try {
                const harvestDetail = await HarvestDetail.findByIdAndUpdate(harvestDetailId, { title: title }, { new: true });
                //const result = await farm.save();
                return {...harvestDetail._doc }
            } catch (err) {
                throw err;
            }
        },

        disableFarm: async(root, { farmId, disable }, { injector }) => {
            try {
                console.log(farmId);
                console.log(disable);

                const farm = await Farm.findByIdAndUpdate(farmId, { disable: disable }, { new: true });
                //const result = await farm.save();
                return farm.disable;
            } catch (err) {
                throw err;
            }
        },
        disableHarvest: async(root, { harvestId, disable }, { injector }) => {
            try {
                const harvest = await Harvest.findByIdAndUpdate(harvestId, { disable: disable }, { new: true });
                //const result = await farm.save();
                return harvest.disable
            } catch (err) {
                throw err;
            }
        },
        disableHarvestDetail: async(root, { harvestDetailId, disable }, { injector }) => {
            try {
                const harvestDetail = await HarvestDetail.findByIdAndUpdate(harvestDetailId, { disable: disable }, { new: true });
                //const result = await farm.save();
                return harvestDetail.disable
            } catch (err) {
                throw err;
            }
        },

    }
};

module.exports = resolvers;