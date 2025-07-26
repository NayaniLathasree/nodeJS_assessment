const { parentPort, workerData } = require('worker_threads');
require('dotenv').config();
const connectDB = require('../network/connection')
const XLSX  = require('xlsx')

connectDB();

const processFile = async () => {
  try {
    const { filePath } = workerData;
    await connectDB();

    const Agent = require('../models/agent');
    const User = require('../models/user');
    const LOB = require('../models/LOB');
    const Carrier = require('../models/carrier');
    const Policy = require('../models/policy');
    const UserAccount = require('../models/account')

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const policyBulk = [];

    for (const row of data) {
      const agent = await Agent.findOneAndUpdate(
        { agentName: row.agent },
        { agentName: row.agent },
        { upsert: true, new: true }
      );

      const user = await User.findOneAndUpdate(
        { email: row.email },
        {
          firstName: row.firstName,
          dob: row.dob,
          address: row.address,
          phoneNumber: row.phone,
          state: row.state,
          zipCode: row.zip,
          email: row.email,
          gender: row.gender,
          userType: row.userType,
        },
        { upsert: true, new: true }
      );

      const lob = row.category_name
        ? await LOB.findOneAndUpdate(
            { categoryName: row.category_name },
            { categoryName: row.category_name },
            { upsert: true, new: true }
          )
        : null;
      const UserAccountInfo = row.category_name
        ? await UserAccount.findOneAndUpdate(
            { accountName: row.account_name },
            { categoryName: row.account_name },
            { upsert: true, new: true }
          )
        : null;
      const carrier = row.company_name
        ? await Carrier.findOneAndUpdate(
            { companyName: row.company_name },
            { companyName: row.company_name },
            { upsert: true, new: true }
          )
        : null;

      if (!user || !agent || !lob || !carrier) {
        console.warn(`Skipped row due to missing refs: ${row.email}`);
        continue;
      }

      const existing = await Policy.findOne({
        userId: user._id,
        categoryId: lob._id,
        companyId: carrier._id,
        agentId: agent._id,
      });

      if (existing) {
        console.warn(`Duplicate policy exists for user: ${row.email}`);
        continue;
      }

      policyBulk.push({
        policyNumber: row.policy_number,
        policyStartDate: new Date(row.policy_start_date),
        policyEndDate: new Date(row.policy_end_date),
        policyType: row.policy_type,
        producer: row.producer,
        premiumAmount: row.premium_amount,
        premiumAmountWritten: row.premium_amount_written,
        userId: user._id,
        categoryId: lob._id,
        companyId: carrier._id,
        agentId: agent._id,
        userAccountId : UserAccount._id
      });
    }

    if (policyBulk.length > 0) {
      await Policy.insertMany(policyBulk, { ordered: false });
    }
    parentPort.postMessage({ success: true, message: 'Data inserted successfully' });
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  }
};

processFile();