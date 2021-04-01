function chunkDateRange(from, to, step){
  var result = []
  var toDate = new Date(to);

  calNextDate(from)

  function calNextDate(start){

    var fromDate = new Date(start);
    var nextDate = new Date(fromDate.setDate(fromDate.getDate() + step));

    if(nextDate.getTime() <= toDate.getTime()){
    
      result.push(
        Object.assign({}, {
          from: new Date(start),
          to: nextDate
        })
      )
      return calNextDate(nextDate)

    }

    result.push(
      Object.assign({}, {
        from: new Date(start),
        to: toDate
      })
    )
  }

  console.log('chunkDateRange', result.length)
  return result
}

async function timeout(timeInSecond){
  return new Promise( ( resolve, reject ) => {

    setTimeout( function(){
      resolve()
    }, timeInSecond * 1000 );

  });
}

module.exports = {
	chunkDateRange: chunkDateRange,
	timeout: timeout
}