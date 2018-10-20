frontend{

}
index{
  walletExplorer(){

    start.insertWallet()
    start.avgHold()
    start.avgExchange()
  }
  insertWallet(){
    start.findWallet()
  }
  blocksExplorer(){

  }
  avgHold(){

  }
  avgExchange(){

  }
}

db{
  findWallet(){
    connect(){
      findToArray()
    }
  }

  findUser()

  insertWallet(){
    ObjEmpty()
    connect(){
      insertOne()
    }
  }

  insertUser(){
    connect(){
      insertOne()
    }
    insertPendingWallet(){
      unknownWallet()
      delay(){
        walletPending()
        connect(){
          insertMany()
        }
      }
    }
  }

  updateWallet()

  updateUser()

}
