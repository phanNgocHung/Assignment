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

exports.listComment = async (req,res,next) => {
    // Luu y truyen dung tham so, neu truyen sai thi mongoose tu tao ra collection theo tham so
    const data = await Comment.find().populate('user','fullName').populate('comic','name')
    res.status(200).json({
        data: data
    });
}
exports.addCommentInApp = async (req, res) => {
    const { comic,user,content,commentDate } = req.body;
    if (!comic || !content || !commentDate) {
        return res.status(400).json(req.body)
    }
    try {
        const newComment = await Comment.create({
            user: user,
            comic: comic,
            content:content,
            commentDate:commentDate,
        });
        res.status(201).json({ message: 'Thêm thành công', newItem: newComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
exports.deleteCommentInApp = async (req, res) => {
    try {
        const _id = req.params._id; // Lấy giá trị maXe từ query parameter
        const deletedItem = await Comment.deleteOne({ _id: _id }); // Tìm và xóa item có id tương ứng
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ message: 'Item deleted successfully', item: deletedItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
