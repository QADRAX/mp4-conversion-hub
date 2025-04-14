import dotenv from 'dotenv';
import { parseCsvString } from './utils/parseCsvString';
import { Mp4Preset } from '@mp4-converter-hub/shared';

dotenv.config();

export const BANNER = `
 #####     #    ######  ######     #    #     #                                       
#     #   # #   #     # #     #   # #    #   #                                        
#     #  #   #  #     # #     #  #   #    # #                                         
#     # #     # #     # ######  #     #    #                                          
#   # # ####### #     # #   #   #######   # #                                         
#    ## #     # #     # #    #  #     #  #   #                                        
 #### # #     # ######  #     # #     # #     #      
       #
              #                                                                       
#    # #####  #    #     ####   ####  #    # #    # ###### #####  ##### ###### #####  
##  ## #    # #    #    #    # #    # ##   # #    # #      #    #   #   #      #    # 
# ## # #    # #    #    #      #    # # #  # #    # #####  #    #   #   #####  #    # 
#    # #####  #######   #      #    # #  # # #    # #      #####    #   #      #####  
#    # #           #    #    # #    # #   ##  #  #  #      #   #    #   #      #   #  
#    # #           #     ####   ####  #    #   ##   ###### #    #   #   ###### #    #                                                                                                                                                                     
`;

export const WATCH_DIR = process.env.WATCH_DIR || '/input';
export const OUTPUT_DIR = process.env.OUTPUT_DIR || '/output';

export const CONCURRENCY = parseInt(process.env.CONCURRENCY || '1', 10);

export const VIDEO_PRESET: Mp4Preset = process.env.VIDEO_PRESET as Mp4Preset || 'medium';
export const VIDEO_CRF: number = parseInt(process.env.VIDEO_CRF || '23', 10);

export const BACKEND_PORT: number = parseInt(process.env.BACKEND_PORT || '3000', 10);

export const ADMIN_USER = process.env.ADMIN_USER || 'admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme';

export const CORS_ALLOWED_ORIGINS: string[] = parseCsvString(process.env.CORS_ALLOWED_ORIGINS || '*');
export const RATE_LIMIT: number = parseInt(process.env.RATE_LIMIT || '5', 10);

export const HTTP_UPLOAD_SIZE_LIMIT_MB: number =  parseInt(process.env.HTTP_UPLOAD_SIZE_LIMIT_MB || '3000', 10);