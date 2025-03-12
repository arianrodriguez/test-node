import { exec } from 'child_process';
import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());

app.post("/set-ip", (req, res) => {
    const {intfce, ip, gateway} = req.body;

    const config = `
        interface ${intfce}
        static ip_address=${ip}/24
        static routers=${gateway}
        static domain_name_servers=${gateway}
    `;

    fs.writeFile("/etc/dhcpcd.conf", config, (err) => {
        if (err) {
           return res.status(500).send("Error setting IP");
        } 

        exec("sudo systemctl restart dhcpcd", (err, stdout, stderr) => {
            if (err) {
                return res.status(500).send("Error reloading the server");
            }

            return res.status(200).send("IP set successfully");
        });
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));