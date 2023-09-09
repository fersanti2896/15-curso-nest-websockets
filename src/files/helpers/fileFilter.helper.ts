

export const fileFilter = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {
    if( !file ) return callback( new Error('File is empty'), false );

    const fileExtension = file.mimetype.split('/')[1];
    const validExtension = ['jpg', 'JPG', 'png', 'PNG', 'gif', 'GIF', 'jpeg', 'JPEG'];

    if( !validExtension.includes( fileExtension ) ) {
        return callback( null, false );
    }

    callback( null, true );
}