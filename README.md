![Logo](admin/deyesun.png)

# ioBroker.deyesun

[![NPM version](https://img.shields.io/npm/v/iobroker.deyesun.svg)](https://www.npmjs.com/package/iobroker.deyesun)
[![Downloads](https://img.shields.io/npm/dm/iobroker.deyesun.svg)](https://www.npmjs.com/package/iobroker.deyesun)
![Number of Installations](https://iobroker.live/badges/deyesun-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/deyesun-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.deyesun.png?downloads=true)](https://nodei.co/npm/iobroker.deyesun/)

**Tests:** ![Test and Release](https://github.com/DoerrSt/ioBroker.deyesun/workflows/Test%20and%20Release/badge.svg)

## deyesun adapter for ioBroker

Query your Deye Sun inverter

There is already a compatible iobroker adapter for Deye Sunxxxxx but it depends on the Deye cloud-service and requiries an API key. So, I decided to create a very lightweight adapter which parses the inbuild web-server of the inverter. Unfortunately, it provides only a very limited set of data (Current, Today, Total) but it's much more than without the API-Key.

The setup is easy, just configure the IP-Address, username and password (admin/admin by default) and you're good to start it.

### DISCLAIMER

All trademarks, logos and brand names are the property of their respective owners. All company, product and service names used are for identification purposes only. Use of these names,trademarks and brands does not imply endorsement.

## Changelog

### 0.0.1

-   (Stefan Dörr) initial release

## License

MIT License

Copyright (c) 2022 Stefan Dörr <doerrst@web.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
