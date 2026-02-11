// companyService code
const { prisma } = require("../../../config/db");
const ApiError = require("../../../utils/apiError");
const { status } = require("http-status");

/**
 * Helper: Check phone number uniqueness
 */
const isPhoneNumberUnique = async (phone, companyId = null) => {
  const existingCompany = await prisma.company.findFirst({
    where: {
      phone,
      id: companyId ? { not: companyId } : undefined,
    },
  });
  return !existingCompany;
};

/**
 * Helper: Check company name uniqueness
 */
const isCompanyNameUnique = async (name, companyId = null) => {
  const existingCompany = await prisma.company.findFirst({
    where: {
      name,
      id: companyId ? { not: companyId } : undefined,
    },
  });
  return !existingCompany;
};

/**
 * create company
 */
const createCompany = async (companyData) => {
  const { name, phone } = companyData;

  if (!(await isCompanyNameUnique(name))) {
    throw new ApiError(status.BAD_REQUEST, "Company name already exists");
  }

  if (!(await isPhoneNumberUnique(phone))) {
    throw new ApiError(status.BAD_REQUEST, "Phone number already exists");
  }

  const company = await prisma.company.create({
    data: companyData,
  });

  return company;
};

module.exports = {
  createCompany,
};
