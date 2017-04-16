import Vapor

let drop = Droplet()

drop.get { req in
    return try drop.view.make("index.html")
}

drop.post { req in
    return "Data posted: \(req.formURLEncoded.debugDescription)"
}

drop.run()
