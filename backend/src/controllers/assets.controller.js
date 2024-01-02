const AssetsModel = require("../models/assets.model");
const InstitutionsModel = require("../models/institutions.model");
const ErrorHandler = require("../utils/error-handler");
exports.index = async (req, res, next) => {
    try {
        // isi fungsi
        const barang = await AssetsModel.find();
        if (!barang) {
            const error = new ErrorHandler(400, "Data tidak ditemukan");
            return next(error);
        }
        res.status(200).json({
            error: false,
            data: barang
        })
    } catch (error) {
        return next(error);
    }
}

exports.getAssetsByType = async (req, res, next) => {
    const kategori = req.params.kategori;
    try {
        // isi fungsi
        const barang = await AssetsModel.find({ kategori: kategori });
        if (!barang) {
            const error = new ErrorHandler(400, `Data dengan kategori ${kategori} tidak ditemukan`);
            return next(error);
        }
        res.status(200).json({
            error: false,
            data: barang
        })
    } catch (error) {
        return next(error);
    }
}

exports.create = async (req, res, next) => {
    try {
        const { valueEstimation, location, assetDesc, assetName, assetType, toAddress, acquisitionDate } = req.body;
        const cekBarang = await AssetsModel.findOne({ assetName: assetName });

        if (cekBarang) {
            const error = new ErrorHandler(400, "Asset sudah pernah didaftarkan");
            return next(error);
        }
        const institution = await InstitutionsModel.findOne({ walletAddress: toAddress })
        if (institution !== null) {
            const asset = new AssetsModel({
                toAddress: toAddress,
                institution: institution.name,
                assetName: assetName,
                assetType: assetType,
                assetDesc: assetDesc,
                location: location,
                valueEstimation: valueEstimation,
                acquisitionDate: acquisitionDate
            });

            await asset.save();
            res.status(200).json({
                error: false,
                message: "Berhasil menyimpan data",
                data: asset
            });
        } else {
            const error = new ErrorHandler(400, "Institusi belum terdaftar");
            return next(error);
        }
    } catch (error) {
        return next(error);
    }
}


exports.show = async (req, res, next) => {
    const idAsset = req.params.id
    try {
        // isi fungsi
        const asset = await AssetsModel.findOne({ _id: idAsset });
        if (!asset) {
            const error = new ErrorHandler(400, "Asset tidak ditemukan");
            return next(error);
        } else {
            res.status(200).json({
                error: false,
                data: asset
            })
        }
    } catch (error) {
        return next(error);
    }
}

exports.update = async (req, res, next) => {
    const idAsset = req.params.id;
    try {
        const { valueEstimation, location, assetDesc, assetName, assetType, institution, toAddress, acquisitionDate } = req.body;
        const asset = await AssetsModel.findOne({ _id: idAsset });

        if (!asset) {
            const error = new ErrorHandler(400, `Asset dengan id ${idAsset} tidak ada`);
            return next(error);
        } else {
            if (valueEstimation != undefined) {
                asset.valueEstimation = valueEstimation;
            }
            if (location != undefined) {
                asset.location = location;
            }
            if (assetDesc != undefined) {
                asset.assetDesc = assetDesc;
            }
            if (assetName != undefined) {
                asset.assetName = assetName;
            }
            if (assetType != undefined) {
                asset.assetType = assetType;
            }
            if (institution != undefined) {
                asset.institution = institution;
            }
            if (toAddress != undefined) {
                asset.toAddress = toAddress;
            }
            if (acquisitionDate != undefined) {
                asset.acquisitionDate = acquisitionDate;
            }
            asset.save();
            res.status(200).json({
                error: false,
                data: "Berhasil memperbarui data asset"
            })
        }
    } catch (error) {
        return next(error);
    }
}

exports.delete = async (req, res, next) => {
    const idAsset = req.params.id
    try {
        // isi fungsi
        const asset = await AssetsModel.findByIdAndDelete({ _id: idAsset });
        if (!asset) {
            const error = new ErrorHandler(404, "Asset tidak ditemukan");
            return next(error);
        }
        res.status(200).json({
            error: false,
            message: "Berhasil menghapus asset"
        })
    } catch (error) {
        return next(error);
    }
}