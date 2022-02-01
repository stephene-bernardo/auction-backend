const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/auction.db',  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the auction SQlite database.');
});


db.serialize(() => {

    let createProductTable = 'CREATE TABLE IF NOT EXISTS products(product_id INTEGER PRIMARY KEY, item_name text, item_description text, image_url text)';
    db.run(createProductTable, (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
       

        let sql = `SELECT item_name FROM products`;

        db.all(sql, [], (err, rows) => {
          if (err) {
            throw err;
          }
          rows.forEach(row => {
            console.log(row.item_name)
          })
          if(rows.length == 0){
            let insertProduct = `INSERT INTO products (product_id, item_name, item_description, image_url)
            VALUES(1, 'Life DeFender', 'Life Defender Premium Disposable Face Masks 3 Ply (50 pcs) - FDA Approved', 'assets/eb24efa3c3854258b442760da164d455.jpg_400x400q90.jpg_.webp'),
            (2, 'Colostomy Bag 70mm', 'by Surgitech 1pc (Disposable)','assets/b4ce6e9239802fc0cd1baaf009e15700.jpg_400x400q90.jpg_.webp'),
            (3, 'Relief Hot Compress', '', 'assets/06ac3eb0c96a21af9e6007b31a5c5c85.jpg_400x400q90.jpg_.webp'),
            (4, 'Faceshield Anti Fog Goggle', 'Sunglasses Unisex Visor Full Face', 'assets/c619b94a4e4105b472a38f413678763e.jpg_400x400q90.jpg_.webp'),
            (5, 'Relief Hot Compress Polka', '', 'assets/72e1489d49c7f5e934e67e4b096ac141.jpg_400x400q90.jpg_.webp'),
            (6, 'Fashion Retainers', 'up only with 1 freebies', 'assets/Haaacc65775f146ec85ad7307951723c6z.jpg'),
            (7, 'Snore Reducer', 'Health&Beyond Adjustable Chin Strap', 'assets/795de3844cd8a7b85b0ae1c4c6cc73d2.png_400x400q90.jpg_.webp'),
            (8, 'Partners Biotape', 'Surgical Tape 1X10(12 rolls)', 'assets/a1f8d61c74e928b3b0c800521c89c416.png_400x400q90.jpg_.webp'),
            (9, 'CleanWell Navy KF94', 'Respiratory Nano Mask', 'assets/f6e6982ca422e0b656cdae51aacad02b.png_400x400q90.jpg_.webp'),
            (10, 'Black llwoul KF94', 'Nano Respirator', 'assets/5d4b9227ad8727391b62bc9b0e66699e.png_400x400q90.jpg_.webp'),                
            (11, 'Tumeric Curcumin Capsule', '100''s - Food Supplement', 'assets/5b9b6ccc6af560018e5043b962e65b4a.jpg_400x400q90.jpg_.webp'),
            (12, 'Top Seller 100% Pure Honey Bee 375ml', '(Unheated, Unpasteurized, Uncultured)Best for Immunity Booster, Food Supplement, Antioxidants, Brain Booster, Relieving Cold and Cough Symptoms, Anti-Bacterial and Rich in Vitamins, Minerals and Enzymes', 'assets/293d2f8ce1bac52c0f251839859340cb.jpg_400x400q90.jpg_ (1).webp'),
            (13, 'ULTIMA-C 30 Capsules', '100% ORIGINAL 3blister (30capsules) (sodium ascorbate) (company price) (food supplement) (pampataba,pampalakas kumain at pampagana kumain) (weight gain) (Organic product) sodium ascorbate, ascorbic acid, energy booster, FDA approved', 'assets/60ff6caccefad72845c702bc4a63c36d.jpg_400x400q90.jpg_.webp'),
            (14, 'SWANSON TART CHERRY 60 Capsule', '', 'assets/3cc8b1c29072f3ede4b4355de3b1a5b4.png_400x400q90.jpg_.webp'),
            (15, 'HYSSOP Vitamin C Immune System Booster 100 Capsules', 'Calcium Ascorbate, Red Acerola, Cherries, ROSEHIP, Guava and Ashitaba, NON ACIDIC Plant-Based VITAMIN C, FDA APPROVED, 600MG/CAPSULE, ORIGINAL', 'assets/56fc7b2fe351eb83784a4848c4e3b4c8.jpg_400x400q90.jpg_.webp'),  
            (16, '3 BOXES IAM Amazing Pure Organic Barley powdered drink mix from Australia', '100% LEGIT / AUTHENTIC / ORIGINAL / IAM Worldwide Amazing Products / barley grass powder / green barley / organic barley / pure barley / barley / NEW STOCKS / (30 Sachets)', 'assets/056156635969b410a6091581a2cb16c3.png_400x400q90.jpg_.webp'),
            (17, 'Indoplas Hot Water Bag 1000ml(red)', '', 'assets/a779cb7b7792dab681e12924178117ef.jpg_400x400q90.jpg_.webp'),
            (18, 'Indoplas Electronic Blood Pressure Monitor 105', '', 'assets/a54db53aa9bbb2c3d73ba4b1c4e477b5.jpg_400x400q90.jpg_.webp'),
            (19, 'LED Light Ear Spoon Ear Picking Tool', 'Ear Wax Remover Cleaner Ear Pick EY-01 CTR', 'assets/0533dc5ded489b031222eee5f4a74b16.png_400x400q90.jpg_.webp'),
            (20, 'PHARMALINE Colors BP Set Purple','', 'assets/568df315bbaae971207c621de112e39e.jpg_400x400q90.jpg_.webp')
    
            `
            db.run(insertProduct, (err) => {
              if (err) {
                console.log(err);
                throw err;
              }
           
            })
          }
        });
        console.log("Created Product Table")
    });

    let createAuctionTable = 'CREATE TABLE IF NOT EXISTS bids(bid_id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER, bid_price REAL, bidder_name TEXT)'
    db.run(createAuctionTable, (err) => {
      if (err) {
          console.log(err);
          throw err;
      }
      console.log("Created Bid Table")
    });
});


const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

app.use(cors())
app.use(express.json()) 

app.get('/products', (req, res) => {

  let getProducts = `SELECT products.product_id, item_name, item_description, image_url, 
  COALESCE(MAX(bid_price), 0) as bid_price, bidder_name
  FROM products
  LEFT JOIN bids ON bids.product_id=products.product_id
  GROUP BY products.product_id`
  db.all(getProducts, [], (err, rows) => {
    if(err){
      console.log(err)
    }
    res.json(rows)
  })
})

app.post('/bids', (req, res) => {

  let insertBid = `INSERT INTO bids(product_id, bid_price, bidder_name) VALUES (?, ?, ?)`
  db.run(insertBid, [req.body['productId'], req.body['bidPrice'], req.body['bidderName']], (err) => {
    if(err){
      console.log(err)
    }
    res.send("Successfuly Inserted")
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})