import { GraphQLResolveInfo } from "graphql";
import { Context } from "../../context";
import { IReviewResolver, Maybe, MutationCreateReviewArgs, ResolverTypeWrapper, Scalars } from "../../generated/schema-types";

export default class Review implements IReviewResolver {

    private _stars: number
    private _commentary: string | null;
    private _episode: string | null;

    constructor({episode, review}: MutationCreateReviewArgs) {
        this._episode = episode ?? null;
        this._stars = review.stars
        this._commentary = review.commentary ?? null;
    }

    stars(args: {}, ctx?: Context, info?: GraphQLResolveInfo): ResolverTypeWrapper<Scalars["Int"]["output"]> {
        return this._stars;
    }

    commentary(args: {}, ctx?: Context, info?: GraphQLResolveInfo): ResolverTypeWrapper<Maybe<Scalars['String']['output']>> {
        return this._commentary;
    }
}