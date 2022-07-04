const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());


/* const events = [
    {
        title: 'Etiam placerat dictum consequat an pellentesque habitant.',
        cost: 88.00,
        img: 'https://i.ibb.co/N2RJ3XL/p-alpha1.png'
    },
    {
        title: 'Varius condimentum consequat frin Aenean pretium risus.',
        cost: 89.00,
        img: 'https://i.ibb.co/T2DQjsp/p-alpha8.png'
    },
    {
        title: 'Praesent sed elit mil In risus nullaam efficitur none.',
        cost: 99.00,
        img: 'https://i.ibb.co/cYXq32F/p-alpha7.png'
    },
    {
        title: 'Sed ultricies sapien arcu, sed cong feugiat sapien.',
        cost: 299.00,
        img: 'https://i.ibb.co/CPjRgpy/p-alpha5.png'
    },
    {
        title: 'Pellentesque habitant morbi malesua tristique senectus.',
        cost: 265.00,
        img: 'https://i.ibb.co/s3tj1Fp/p-alpha3.png'
    },
    {
        title: 'San francisco golden gate bridge, cable & fog.',
        cost: 199.00,
        img: 'https://i.ibb.co/dcDwm7x/p-alpha2.png'
    },
    {
        title: 'Etiam placerat dictum consequat an pellentesque habitant.',
        cost: 120.00,
        img: 'https://i.ibb.co/cYXq32F/p-alpha7.png'
    },
    {
        title: 'Varius condimentum consequat frin Aenean pretium risus.',
        cost: 119.00,
        img: 'https://i.ibb.co/10P31j0/p-alpha4.png'
    },
    {
        title: 'Praesent sed elit mil In risus nullaam efficitur none.',
        cost: 159.00,
        img: 'https://i.ibb.co/s3tj1Fp/p-alpha3.png'
    },
    {
        title: 'Sed ultricies sapien arcu, sed cong feugiat sapien.',
        cost: 195.00,
        img: 'https://i.ibb.co/CPjRgpy/p-alpha5.png'
    },
    {
        title: 'Pellentesque habitant morbi malesua tristique senectus.',
        cost: 142.00,
        img: 'https://i.ibb.co/N2RJ3XL/p-alpha1.png'
    },
    {
        title: 'San francisco golden gate bridge, cable & fog.',
        cost: 174.00,
        img: 'https://i.ibb.co/T2DQjsp/p-alpha8.png'
    },
] */



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.madlbkn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();
        // console.log('Database Connected');

        const db = client.db('goldenWings');
        const eventCollection = db.collection('events');
        const bookingCollection = db.collection('bookings');


        //GET ALL ENENTS
        app.get('/events', async (req, res) => {
            const cursor = eventCollection.find({});
            const events = await cursor.toArray();
            res.json(events)
        })

        //GET THE EVENT
        app.get('/event/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const event = await eventCollection.findOne(query);
            res.json(event)
        })

        //SUBMIT BOOKING POST API
        app.post('/mybooking', async (req, res)=>{
            const bookingData = req.body;
            const booking = await bookingCollection.insertOne(bookingData);
            res.json(booking);
        })

        //GETTING ALL BOOKINGS
        app.get('/bookings', async (req, res)=>{
            const cursor = bookingCollection.find({});
            const bookings = await cursor.toArray();
            res.json(bookings);
        })

        //GETTING MY BOOKED EVENTS BY EMAIL
        app.get('/myevents/:email', async (req, res)=>{
            const email = req.params.email;
            const query = {email: email};
            const cursor = bookingCollection.find(query);
            const myEvents = await cursor.toArray();
            res.json(myEvents)
        })

        //DELETE MY BOOKINGS as EVENTS
        app.delete('/myevent/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const delBooking = await bookingCollection.deleteOne(query);
            res.json(delBooking);
        })

        //DELETE EVENTS
        app.delete('/events/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const delEvents = await eventCollection.deleteOne(query);
            res.json(delEvents);
        })




    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Golden Wings Server is Connected');
})

app.listen(port, () => {
    console.log('Listening to port', port);
})