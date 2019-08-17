const vCardsJS = require("vcards-js");
const mycardvcf = require("mycardvcf");
const fs = require("fs");

exports.convertJSONtoVCard = data => {
  //     let vCard = mycardvcf.parseMyCardJSON(data);
  //      //var contents = vCard.toString();
  //    // const contents = vCard.toString();
  //     vCard.saveToFile = function (filename) {
  //        // var vCardFormatter = require('./lib/vCardFormatter');
  //         var contents = vCard.toString( '4.0' )
  //         fs.writeFileSync(filename, contents, { encoding: 'utf8' });
  //     }
  //     return vCard;

  var vCard = vCardsJS();
  //set basic properties shown before
  vCard.version = "3.0"; //can also support 2.1 and 4.0, certain versions only support certain fields
  if (data.contact) {
    if (data.contact.contactType) {
      //TODO:
    }
    if (data.contact.birthday) {
    let date = new Date(data.contact.birthday)
      vCard.birthday = date;
    }

    if (data.contact.namePrefix) {
      vCard.namePrefix = data.contact.namePrefix;
    }

    if (data.contact.givenName) {
      vCard.firstName = data.contact.givenName;
    }

    if (data.contact.middleName) {
      vCard.middleName = data.contact.middleName;
    }

    if (data.contact.familyName) {
      vCard.lastName = data.contact.familyName;
    }
    if (data.contact.previousFamilyName) {
      //NA
    }
    if (data.contact.nameSuffix) {
      vCard.nameSuffix = data.contact.nameSuffix;
    }
    if (data.contact.nickname) {
      vCard.nickname = data.contact.nickname;
    }
    if (data.contact.organizationName) {
      vCard.organization = data.contact.organizationName;
    }
    if (data.contact.departmentName) {
      //NA
    }
    if (data.contact.jobTitle) {
      vCard.role = data.contact.jobTitle;
    }
    if (data.contact.note) {
      vCard.note = data.contact.note;
      vCard.note += "\n\nconnected with my.card";
    }
    if (data.contact.imageData) {
      //TODO:
    }
    if (data.contact.socialProfiles) {
      data.contact.socialProfiles.forEach(function(elem) {
        let service = elem.service.toLowerCase();
        vCard.socialUrls[service] = elem.url;
      });
    }
    if (data.contact.phoneNumbers) {
        vCard.homePhone = [];
        vCard.workPhone = [];
        vCard.cellPhone = [];
        vCard.otherPhone = [];
        data.contact.phoneNumbers.forEach(function(elem) {
            const label = elem.label.toLowerCase();
            if(label === 'home') {
                vCard.homePhone.push(elem.phoneNumber);
            } else if (label === 'work') {
                vCard.workPhone.push(elem.phoneNumber);
            } else if (label === 'mobile' || label === 'cell')  {
                vCard.cellPhone.push(elem.phoneNumber);
            } else {
                vCard.otherPhone.push(elem.phoneNumber);
            }
        });
    }

    if (data.contact.urls) {
      //not clean b/c vcards-js won't let you add url array
      if(data.contact.urls.length >= 1) {
        vCard.url = data.contact.urls[0].url;
      }
      if(data.contact.urls.length >= 2) {
        vCard.workUrl = data.contact.urls[1].url;
      }
    }

    if (data.contact.postalAddresses) {
      //not clean b/c vcards-js won't let you add postalAddresses array
      if(data.contact.postalAddresses.length >= 1) {
        let tmp = data.contact.postalAddresses[0];
        vCard.homeAddress.label = tmp.label;
        vCard.homeAddress.street = tmp.data.street;
        vCard.homeAddress.city = tmp.data.city;
        vCard.homeAddress.stateProvince = tmp.data.state;
        vCard.homeAddress.postalCode = tmp.data.postalCode;
        vCard.homeAddress.countryRegion = tmp.data.country;
        //missing isoCountryCode
      }

      if(data.contact.postalAddresses.length >= 2) {
        let tmp = data.contact.postalAddresses[1];
        vCard.workAddress.label = tmp.label;
        vCard.workAddress.street = tmp.data.street;
        vCard.workAddress.city = tmp.data.city;
        vCard.workAddress.stateProvince = tmp.data.state;
        vCard.workAddress.postalCode = tmp.data.postalCode;
        vCard.workAddress.countryRegion = tmp.data.country;
      }
    }
    if (data.contact.emails) {
        vCard.email = data.contact.emails.map(function(email) {
            return email.mail;
        });
    }
  }
//   vCard.uid = "69531f4a-c34d-4a1e-8922-bd38a9476a53";

//   //link to image
//   vCard.photo.attachFromUrl(
//     "https://avatars2.githubusercontent.com/u/5659221?v=3&s=460",
//     "JPEG"
//   );

//   //or embed image
//   vCard.photo.attachFromUrl("/path/to/file.jpeg");

//   vCard.workPhone = "312-555-1212";
//   vCard.url = "https://github.com/enesser";
//   vCard.workUrl = "https://acme-corporation/enesser";

//   //set other vitals

//   vCard.gender = "M";
//   vCard.anniversary = new Date(2004, 0, 1);
// //multiple email entry


// //multiple cellphone
// vCard.cellPhone = [
//     '312-555-1414',
//     '312-555-1415',
//     '312-555-1416'
// ];
//   //set other phone numbers
//   vCard.homePhone = "312-555-1313";
//   vCard.cellPhone = "312-555-1414";
//   vCard.pagerPhone = "312-555-1515";
//   //set fax/facsimile numbers
//   vCard.homeFax = "312-555-1616";
//   vCard.workFax = "312-555-1717";

//   //set email addresses
//   vCard.email = "e.nesser@emailhost.tld";
//   vCard.workEmail = "e.nesser@acme-corporation.tld";

//   //set logo of organization or personal logo (also supports embedding, see above)
//   vCard.logo.attachFromUrl(
//     "https://avatars2.githubusercontent.com/u/5659221?v=3&s=460",
//     "JPEG"
//   );

//   //set URL where the vCard can be found
//   vCard.source = "http://mywebpage/myvcard.vcf";
//   //set address information

//   //set social media URLs
//   //you can also embed photos from files instead of attaching via URL
//   vCard.photo.embedFromFile("photo.jpg");
//   vCard.logo.embedFromFile("logo.jpg");

  return vCard;
};
