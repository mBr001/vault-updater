let randomstring = require('randomstring')

exports.setup = (runtime) => {
  let braveCorePost = {
    method: 'POST',
    path: '/1/bc-crashes',
    handler: function (request, h) {
      let crash_id = randomstring.generate({
        length: 16,
        charset: 'hex'
      })
      const payload = request.payload
      if (!payload) {
        return h.response('Missing payload').code(400)
      }
      payload.ts = (new Date()).getTime()
      payload.crash_id = crash_id
      delete payload.guid
      runtime.mongo.models.insertCrash(payload, 'braveCore', (err, results) => {
        console.log(`crash recorded for version ${payload.ver}`)
      })
      return h.response(crash_id)
    },
    options: {
      description: "* Record crash for Brave Core",
    }
  }

  return [braveCorePost]
}
