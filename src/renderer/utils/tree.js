

let response = {
    "status":200,
    "result":[
        {
            "serianNumber":"84ABB9FB",
            "alias":"computer",
            "path":"/root",
            "isdir":"",
            "modifiedNum":86,
            "children":[
                {
                    "isdir": false,
                    "alias": "a.fa",
                    "path": "/a.fa",
                    "status": 1
                },
                {
                    "isdir": true,
                    "alias": "fa",
                    "path":"/qg/34",
                    "children": [
                        {
                            "isdir": false,
                            "alias": "b.fa",
                            "path": "/fa/b.fa",
                            "status": 1
                        },
                        {
                            "isdir": false,
                            "alias": "c.fa",
                            "path": "/fa/c.fa",
                            "status": 1
                        }
                    ]
                }
            ]

        },
        {
            "serialNumber": "666666",
            "alias":"usb",
            "path":"/root2",
            "isDir":"",
            "modifiedNum":86,
            "children":[
                {
                    "isdir": false,
                    "alias": "a.fa",
                    "path": "/a2.fa",
                    "status": 1
                },
                {
                    "isdir": true,
                    "alias": "fa",
                    "path":"/qwd/34",
                    "children": [
                        {
                            "isdir": false,
                            "alias": "b.fa",
                            "path": "/fa2/b.fa",
                            "status": 1
                        },
                        {
                            "isdir": false,
                            "alias": "c.fa",
                            "path": "/fa3/c.fa",
                            "status": 1
                        }
                    ]
                }
            ]

        }
    ]
}
 
export default response['result'];
