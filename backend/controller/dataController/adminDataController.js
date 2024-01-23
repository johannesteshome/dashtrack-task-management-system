const { StatusCodes } = require("http-status-codes");
const { UserModel } = require("../../models/User.model");

const allAdmins = async (req, res) => {
  try {
    const admins = await UserModel.find({role: 'admin'});
    res.status(StatusCodes.OK).send(admins);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).send({ error: "Something went wrong" });
  }
};

const getAdmin = async (req, res) => {
  const id = req.params.adminId;

  try {
    const admin = await UserModel.findOne({_id:id, role:"admin"});

    if (!admin) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: "User not found" });
    }

    res.status(StatusCodes.OK).send(admin);
  } catch (error) {
    console.error("Error2:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({message: "Server Error"});
  }
};

const updateAdmin = async (req, res) => {
  const id = req.params.adminId;
  const payload = req.body;
  try {
    const admin = await UserModel.findByIdAndUpdate({ _id: id }, payload);
    if (!admin) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: `Admin not found`, success: false });
    }
    res.status(StatusCodes.OK).send({message: `Admin updated`, success: true});
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Something went wrong, unable to Update.", success: false });
  }
};

const deleteAllAdmins = async (req, res) => {
  try {
    await UserModel.deleteMany({role: 'admin'});
    res.status(StatusCodes.OK).send("All admins deleted");
  } catch (error) {
    console.error("Error:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
};

//TODO  deleting users may have some issues because we are not deleteing based on user role but with ID
const deleteAdmin = async (req, res) => {
  const id = req.params.adminId;
  try {
    const admin = await UserModel.findByIdAndDelete({ _id: id });
    if (!admin) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ msg: `Admin with id ${id} not found` });
    }
    res.status(StatusCodes.OK).send(`Admin with id ${id} deleted`);
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Something went wrong, unable to Delete." });
  }
};

module.exports = {
  allAdmins,
  getAdmin,
  updateAdmin,
  deleteAllAdmins,
  deleteAdmin,
};
