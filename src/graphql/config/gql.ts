import { HttpStatus } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { GqlModuleOptions } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { ObjectIDResolver } from 'graphql-scalars';

export default registerAs(
    'graphql',
    () =>
    ( {
        typePaths: process.env.GRAPHQL_TYPE_PATHS
            ? process.env.GRAPHQL_TYPE_PATHS.split( ',' )
            : [ './**/*.graphql' ],
        playground:
            ~[ true, 'true' ].indexOf( process.env.GRAPHQL_PLAYGROUND ) ||
            !process.env.GRAPHQL_PLAYGROUND,
        introspection:
            ~[ true, 'true' ].indexOf( process.env.GRAPHQL_PLAYGROUND ) ||
            !process.env.GRAPHQL_PLAYGROUND,
        debug: !!(
            ~[ true, 'true' ].indexOf( process.env.GRAPHQL_DEBUG ) ||
            !process.env.GRAPHQL_DEBUG
        ),
        resolvers: {
            ObjectID: ObjectIDResolver,
        },
        formatError: ( error: GraphQLError ) =>
        {
            const graphQLFormattedError = {
                status: HttpStatus[ error.extensions.code ],
                message: error.message,
            };
            return graphQLFormattedError;
        },
        context: ( { req } ) => ( { request: req } ),
        resolverValidationOptions: {
            requireResolversForArgs: false,
            requireResolversForNonScalar: false,
            requireResolversForAllFields: false,
            requireResolversForResolveType: false,
            allowResolversNotInSchema: false,
        },

    } as GqlModuleOptions ),
);
