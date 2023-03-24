import { Router, Request, Response } from "express";
import { IsAuthenticated } from "../utils/AuthGuards";
import { query, validationResult } from 'express-validator';
import { DigitalBookSchema } from "../schemas/BookSchema";

const router = Router();

router.get('/', IsAuthenticated, query("text").notEmpty().isString(), query('page').notEmpty().isNumeric(), query('pageSize').notEmpty().isNumeric(), (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }

    let page = Number(req.query.page);
    let pageSize = Number(req.query.pageSize);
    let searchText = String(req.query.text);

    let startIndex = (page - 1) * pageSize;
    let endIndex = page * pageSize;

    DigitalBookSchema.find({ $text: { $search: searchText } })
        .skip(startIndex)
        .limit(pageSize)
        .exec()
        .then((results) => {
            DigitalBookSchema.countDocuments().exec().then((totalBooks) => {
                res.status(200).json({
                    status: "success",
                    books: results,
                    totalPages: Math.ceil(totalBooks / pageSize),
                    currentPage: page,
                    hasPreviousPage: page > 1,
                    hasNextPage: endIndex < totalBooks
                });
            });
        })
        .catch((error) => {
            res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
        });

});

router.get('/title', IsAuthenticated, query("title").notEmpty().isString(), query('page').notEmpty().isNumeric(), query('pageSize').notEmpty().isNumeric(), (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }
    let page = Number(req.query.page);
    let pageSize = Number(req.query.pageSize);
    let titleQuery = req.query.title;

    let startIndex = (page - 1) * pageSize;
    let endIndex = page * pageSize;

    if (titleQuery?.length && titleQuery.length >= 3) {
        titleQuery = { title: { $regex: titleQuery, $options: 'i' } };
    } else {
        titleQuery = { title: { $regex: `^${titleQuery}$`, $options: 'i' } };
    }

    DigitalBookSchema.find(titleQuery)
        .skip(startIndex)
        .limit(pageSize)
        .exec()
        .then((results) => {
            DigitalBookSchema.countDocuments().exec().then((totalBooks) => {
                res.status(200).json({
                    status: "success",
                    books: results,
                    totalPages: Math.ceil(totalBooks / pageSize),
                    currentPage: page,
                    hasPreviousPage: page > 1,
                    hasNextPage: endIndex < totalBooks
                });
            });
        })
        .catch((error) => {
            res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
        });

});

router.get('/author', IsAuthenticated, query("author").notEmpty().isString(), query('page').notEmpty().isNumeric(), query('pageSize').notEmpty().isNumeric(), (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }
    let page = Number(req.query.page);
    let pageSize = Number(req.query.pageSize);

    let startIndex = (page - 1) * pageSize;
    let endIndex = page * pageSize;

    DigitalBookSchema.find({ authors: req.query.author })
        .skip(startIndex)
        .limit(pageSize)
        .exec()
        .then((results) => {
            DigitalBookSchema.countDocuments().exec().then((totalBooks) => {
                res.status(200).json({
                    status: "success",
                    books: results,
                    totalPages: Math.ceil(totalBooks / pageSize),
                    currentPage: page,
                    hasPreviousPage: page > 1,
                    hasNextPage: endIndex < totalBooks
                });
            });
        })
        .catch((error) => {
            res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
        });

});

router.get('/isbn', IsAuthenticated, query("isbn").notEmpty().isISBN(), (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }

    DigitalBookSchema.find({isbn : req.query.isbn})
    .select('-url')
    .then((results) => {
        if(!results)
        {
            res.status(200).json({
                status: "fail",
                message :  "მოცემული წიგნი სისტემაში არ არსებობს!"
            });
        }
        res.status(200).json({
            status: "success",
            books: results
        });
    })
    .catch((error) => {
        res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
    });
});

router.get('/category', IsAuthenticated, query("category").notEmpty().isString(), (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }

    DigitalBookSchema.find({category : req.query.category})
    .select('-url')
    .then((results) => {
        if(!results)
        {
            res.status(200).json({
                status: "fail",
                message :  "მოცემული წიგნი სისტემაში არ არსებობს!"
            });
        }
        res.status(200).json({
            status: "success",
            books: results
        });
    })
    .catch((error) => {
        res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
    });


});
export default router;