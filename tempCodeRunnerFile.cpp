#include<bits/stdc++.h>
using namespace std;

bool decider(vector<long long int> &a,vector<long long int> &b,vector<long long int> &c,long long int sumt,int order){
    int l1=0;
    int r1=0;
    int n=a.size();
    long long int sum1=a[l1];
    while(sum1<sumt && r1<=n-3) {
        r1++;
        sum1+=a[r1];
    }
    if(r1==n-2){
        return false;
    }
    int l2=r1+1;
    int r2=r1+1;
    long long int sum2=b[l2];
    while(sum2<sumt && r2<=n-2){
        r2++;
        sum2+=b[r2];
    }
    if(r2==n-1){
        return false;
    }
    int l3=r2+1;
    int r3=r2+1;
    long long int sum3=c[l3];
    while(sum3<sumt && r3<=n-2){
        r3++;
        sum3+=c[r3];
    }
    if(sum3<sumt){
        return false;
    }
    else{
        r3=n-1;
        if(order==1){
            cout<<l1+1<<' '<<r1+1<<' '<<l2+1<<' '<<r2+1<<' '<<l3+1<<' '<<r3+1<<endl;
        }
        else if(order==2){
            cout<<l1+1<<' '<<r1+1<<' '<<l3+1<<' '<<r3+1<<' '<<l2+1<<' '<<r2+1<<endl;
        }
        else if(order==3){
            cout<<l2+1<<' '<<r2+1<<' '<<l1+1<<' '<<r1+1<<' '<<l3+1<<' '<<r3+1<<endl;
        }
        else if(order==4){
            cout<<l3+1<<' '<<r3+1<<' '<<l1+1<<' '<<r1+1<<' '<<l2+1<<' '<<r2+1<<endl;
        }
        else if(order==5){
            cout<<l2+1<<' '<<r2+1<<' '<<l3+1<<' '<<r3+1<<' '<<l1+1<<' '<<r1+1<<endl;
        }
        else{
            cout<<l3+1<<' '<<r3+1<<' '<<l2+1<<' '<<r2+1<<' '<<l1+1<<' '<<r1+1<<endl;
        }

       return true;
    }
}

int main(){
    int t;
    cin>>t;
    while(t--){
        int n;
        cin>>n;
        vector<long long int> a(n);
        vector<long long int> b(n);
        vector<long long int> c(n);
        long long int sumt=0;

        for(int i=0;i<n;i++){
            cin>>a[i];
            sumt+=a[i];
        }
        for(int i=0;i<n;i++){
            cin>>b[i];
        }
        for(int i=0;i<n;i++){
            cin>>c[i];
        }

        sumt=(sum+2)/3;

        //6 cases 
        bool test=false;
        test=decider(a,b,c,sumt,1);
        if(test==true){
            continue;
        }
        test=decider(a,c,b,sumt,2);
        if(test==true){
            continue;
        }
        test=decider(b,a,c,sumt,3);
        if(test==true){
            continue;
        }
        test=decider(b,c,a,sumt,4);
        if(test==true){
            continue;
        }
        test=decider(c,a,b,sumt,5);
        if(test==true){
            continue;
        }
        test=decider(a,b,a,sumt,6);
        if(test==true){
            continue;
        }
        else{
            cout<<-1<<endl;
        }
        
    }
}
