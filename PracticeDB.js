const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'task-manager';

const main = async () =>  {
  await client.connect();
  const db = client.db(dbName);

  // await db.collection('tasks').insertOne({
  //   desc: "Shooting Short Film",
  //   completed : false
  // })

  // await db.collection('documents').updateOne({
  //   age: 20
  // } , {
  //   $inc : {
  //     age : 1
  //   }
  // })

  // const data = await db.collection('tasks').updateOne({
  //   desc : "Buying Vegetables"
  // } , {
  //   $set : {
  //     desc : "Buying Clothes"
  //   }
  // } , (error , user) => {
  //   if (error) {
  //     return console.log("Not Found.")
  //   }
  //   return console.log(user)
  // })

  // await db.collection('tasks').insertMany([
  //   {
  //     desc: "Appointment",
  //     completed : true
  //   },{
  //     desc : "Buying Vegetables" ,
  //     completed : false
  //   }
  // ])

  // await db.collection('tasks').deleteMany(
  //     {
  //       completed: true
  //     }
  //   ).then( (result) => {
  //     console.log(result)
  //   }).catch( (error) => {
  //     console.log(error)
  //   })

  // await db.collection('tasks').deleteMany(
  //     {
  //       completed : false,
  //     }
  //   )

  // await db.collection('tasks').updateMany(
  //   {
  //     completed : true
  //   },{
  //     $set : {
  //       completed : false 
  //     }
  //   }).then( (result) => {
  //     console.log(result.modifiedCount)
  //   }).catch( (error) => {
  //     console.log(error)
  //   })

  return "Updated Successfully"
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
