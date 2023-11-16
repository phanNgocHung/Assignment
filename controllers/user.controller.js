const User = require('../models/user.model');
const Comment = require('../models/comment.model');
const multer = require ('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Duong dan luu tru file
    },
    // Tu dong dat ten anh la thoi gian hien tai + 1 so random
    filename: function (req, file, cb) {
        cb(null,file.originalname);
    }
});
const upload = multer({
    storage: storage,
});

exports.listUser = async (req, res, next)=>{

    let dieu_kien_loc = null;
    if(typeof(req.query._id) != 'undefined'){
        dieu_kien_loc = { _id: req.query._id}
    }
    var list = await User.find(dieu_kien_loc)
    res.send(list);
}
exports.addUser = async (req,res,next) => {
    const { fullName, phoneNumber, address,username,password,email,image } = req.body;
    if (!fullName || !phoneNumber || !address || !username || !password || !email) {
        return res.status(400).json({ message: 'Thiếu thông tin người dùng' });
    }
    try {
        const newUser = await User.create({
            fullName: fullName,
            username: username,
            email: email,
            password: password,
            address: address,
            phoneNumber: phoneNumber,
            image: image // Lưu đường dẫn tạm thời của tệp tin đã tải lên
        });
        res.status(201).json({ message: 'Thêm người dùng thành công', newItem: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
}
exports.updateUser = async (req,res,next) => {
    try {
        const { _id,fullName, phoneNumber, address,username,password,email,image } = req.body;

        // let image = req.file ? req.file.path : null;

        if (!fullName || !username || !email || !password || !phoneNumber || !address) {
            return res.status(400).json(req.body)
        }
        const updatedFields = {
            fullName: fullName,
            phoneNumber: phoneNumber,
            username: username,
            email: email,
            password: password,
            address: address,
            image:image
        };
        // Kiểm tra xem có tệp tin mới được gửi lên không
        // if (image) {
        //     updatedFields.image = image;
        // }
        const updatedItem = await User.findOneAndUpdate(
            { _id: _id },
            updatedFields,
            { new: true }
        );
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ message: 'Item updated successfully', item: updatedItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const dataComment = await Comment.find();
        const _id = req.params._id;
        // Lọc ra tất cả các comment của user có _id
        const commentOfUser = dataComment.filter(com => com.user.equals(_id));
        // Lấy danh sách user ids cần xóa
        const userIDsToDelete = commentOfUser.map(comment => comment.user);
        if (userIDsToDelete.length > 0) {
            const deletedComments = await Comment.deleteMany({ user: { $in: userIDsToDelete } });
            console.log(deletedComments);
        }
        // Xóa user
        const deletedItem = await User.deleteOne({ _id: _id });

        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        console.log(dataComment);

        res.json({
            message: 'Item deleted successfully',
            item: deletedItem,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

