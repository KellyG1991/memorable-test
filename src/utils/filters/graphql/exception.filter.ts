import { GqlExceptionFilter } from '@nestjs/graphql';
import { Catch, HttpException } from '@nestjs/common';

@Catch( HttpException )
export class GraphQLExceptionFilter implements GqlExceptionFilter
{
  catch ( exception: HttpException )
  {
    const { error, message } = exception.getResponse() as any;
    let msg = message || error;
    msg =
      typeof msg === 'object' && Array.isArray( msg )
        ? msg[ 0 ][ Object.keys( msg[ 0 ] )[ 0 ] ][ 0 ]
        : msg;

    throw new Error( msg );
  }
}
