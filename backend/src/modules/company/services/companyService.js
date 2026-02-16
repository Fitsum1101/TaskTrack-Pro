// companyService code
const { prisma } = require("../../../config/db");
const ApiError = require("../../../utils/apiError");
const { status } = require("http-status");

/**
 * Helper: Check comapny existes by id
 */

const isCompanyExistes = async (id) => {
  return await prisma.company.findUnique({
    where: { id },
  });
};

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

/**
 * edit company
 */

const updateCompany = async (data) => {
  if (!(await isCompanyNameUnique(data.name, data.id))) {
    throw new ApiError(status.BAD_REQUEST, "Company name already exists");
  }

  if (!(await isPhoneNumberUnique(data.phone, data.id))) {
    throw new ApiError(status.BAD_REQUEST, "Phone number already exists");
  }
  return await prisma.company.update({
    where: {
      id: data.id,
    },
    data,
  });
};

/**
 * delete company
 */

const deleteCompany = async (id) => {
  if (!isCompanyExistes(id)) {
    throw new ApiError(status.NOT_FOUND, "resource does not existes");
  }
  return await prisma.company.update({
    where: {
      id,
    },
    data: {
      status: "REJECTED",
    },
  });
};

module.exports = {
  createCompany,
  updateCompany,
  deleteCompany,
};
