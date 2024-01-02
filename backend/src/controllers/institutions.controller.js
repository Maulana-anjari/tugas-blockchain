const InstitutionsModel = require("../models/institutions.model");
const ErrorHandler = require("../utils/error-handler");
exports.index = async (req, res, next) => {
    try {
        // isi fungsi
        const institusi = await InstitutionsModel.find();
        if (!institusi) {
            const error = new ErrorHandler(400, "Data tidak ditemukan");
            return next(error);
        }
        res.status(200).json({
            error: false,
            data: institusi
        })
    } catch (error) {
        return next(error);
    }
}

exports.create = async (req, res, next) => {
    try {
        const { name, walletAddress } = req.body;
        const cekInstitusi = await InstitutionsModel.findOne({ name: name });

        if (cekInstitusi) {
            const error = new ErrorHandler(400, "Institusi sudah terdaftar");
            return next(error);
        }

        const institusi = new InstitutionsModel({
            name: name,
            walletAddress: walletAddress
        });

        await institusi.save();
        res.status(200).json({
            error: false,
            message: "Berhasil menyimpan data",
            data: institusi
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
}


exports.show = async (req, res, next) => {
    const idInstitusi = req.params.id
    try {
        // isi fungsi
        const asset = await InstitutionsModel.findOne({ _id: idInstitusi });
        if (!asset) {
            const error = new ErrorHandler(400, "Institusi tidak ditemukan");
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
    const idInstitusi = req.params.id;
    try {
        const { name, walletAddress } = req.body;
        const institusi = await InstitutionsModel.findOne({ _id: idInstitusi });

        if (!institusi) {
            const error = new ErrorHandler(400, `Institusi dengan id ${idInstitusi} tidak ada`);
            return next(error);
        } else {
            if (name != undefined) {
                institusi.name = name;
            }
            if (walletAddress != undefined) {
                institusi.walletAddress = walletAddress;
            }
            institusi.save();
            res.status(200).json({
                error: false,
                data: "Berhasil memperbarui data institusi"
            })
        }
    } catch (error) {
        return next(error);
    }
}

exports.delete = async (req, res, next) => {
    const idInstitusi = req.params.id
    try {
        // isi fungsi
        const institusi = await InstitutionsModel.findByIdAndDelete({ _id: idInstitusi });
        if (!institusi) {
            const error = new ErrorHandler(404, "Institusi tidak ditemukan");
            return next(error);
        }
        res.status(200).json({
            error: false,
            message: "Berhasil menghapus institusi"
        })
    } catch (error) {
        return next(error);
    }
}