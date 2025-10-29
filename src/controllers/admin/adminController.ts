import { Request, Response } from "express";
import { adminUserService } from "../../services/admin";

export const registerAdminUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await adminUserService.createAdminUser(req.body);

    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      data: {
        user: {
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          permissions: result.user.permissions,
          department: result.user.department,
          phoneNumber: result.user.phoneNumber,
          badgeNumber: result.user.badgeNumber,
          shift: result.user.shift,
          isActive: result.user.isActive,
        },
        token: result.token,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Error creating admin user",
    });
  }
};

export const loginAdminUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, rememberMe = false } = req.body;

    const result = await adminUserService.loginAdminUser(email, password, rememberMe);

    res.status(200).json({
      success: true,
      message: "Admin user logged in successfully",
      data: {
        user: {
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          permissions: result.user.permissions,
          department: result.user.department,
          phoneNumber: result.user.phoneNumber,
          badgeNumber: result.user.badgeNumber,
          shift: result.user.shift,
          isActive: result.user.isActive,
          lastLogin: result.user.lastLogin,
        },
        token: result.token,
      },
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || "Invalid credentials",
    });
  }
};

export const getAdminProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const adminUser = await adminUserService.getAdminUserById(userId);

    res.status(200).json({
      success: true,
      message: "Admin user profile retrieved successfully",
      data: {
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          permissions: adminUser.permissions,
          department: adminUser.department,
          phoneNumber: adminUser.phoneNumber,
          badgeNumber: adminUser.badgeNumber,
          profileImage: adminUser.profileImage,
          isActive: adminUser.isActive,
          lastLogin: adminUser.lastLogin,
          createdAt: adminUser.createdAt,
          updatedAt: adminUser.updatedAt,
        },
      },
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Admin user not found",
    });
  }
};

export const updateAdminProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const updateData = req.body;
    const file = req.file;

    const adminUser = await adminUserService.updateAdminUser(userId, updateData, file);

    res.status(200).json({
      success: true,
      message: "Admin user profile updated successfully",
      data: {
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          permissions: adminUser.permissions,
          department: adminUser.department,
          phoneNumber: adminUser.phoneNumber,
          badgeNumber: adminUser.badgeNumber,
          profileImage: adminUser.profileImage,
          isActive: adminUser.isActive,
          lastLogin: adminUser.lastLogin,
          createdAt: adminUser.createdAt,
          updatedAt: adminUser.updatedAt,
        },
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Error updating admin user profile",
    });
  }
};

export const getAllAdminUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      role: req.query.role as any,
      department: req.query.department as string,
      search: req.query.search as string,
    };

    const result = await adminUserService.getAllAdminUsers(query);

    res.status(200).json({
      success: true,
      message: "Admin users retrieved successfully",
      data: {
        users: result.users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions,
          department: user.department,
          phoneNumber: user.phoneNumber,
          badgeNumber: user.badgeNumber,
          shift: user.shift,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })),
        pagination: result.pagination,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error retrieving admin users",
    });
  }
};

export const getAdminUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const adminUser = await adminUserService.getAdminUserById(id as string);

    res.status(200).json({
      success: true,
      message: "Admin user retrieved successfully",
      data: {
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          permissions: adminUser.permissions,
          department: adminUser.department,
          phoneNumber: adminUser.phoneNumber,
          badgeNumber: adminUser.badgeNumber,
          profileImage: adminUser.profileImage,
          isActive: adminUser.isActive,
          lastLogin: adminUser.lastLogin,
          createdAt: adminUser.createdAt,
          updatedAt: adminUser.updatedAt,
        },
      },
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Admin user not found",
    });
  }
};

export const updateAdminUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const adminUser = await adminUserService.updateAdminUser(id as string, updateData);

    res.status(200).json({
      success: true,
      message: "Admin user updated successfully",
      data: {
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          permissions: adminUser.permissions,
          department: adminUser.department,
          phoneNumber: adminUser.phoneNumber,
          badgeNumber: adminUser.badgeNumber,
          profileImage: adminUser.profileImage,
          isActive: adminUser.isActive,
          lastLogin: adminUser.lastLogin,
          createdAt: adminUser.createdAt,
          updatedAt: adminUser.updatedAt,
        },
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Error updating admin user",
    });
  }
};

export const deleteAdminUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const adminUser = await adminUserService.deleteAdminUser(id as string);

    res.status(200).json({
      success: true,
      message: "Admin user deactivated successfully",
      data: {
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          isActive: adminUser.isActive,
        },
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Error deactivating admin user",
    });
  }
};

export const getAdminRolesAndPermissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await adminUserService.getAdminRolesAndPermissions();

    res.status(200).json({
      success: true,
      message: "Admin roles and permissions retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error retrieving admin roles and permissions",
    });
  }
};
